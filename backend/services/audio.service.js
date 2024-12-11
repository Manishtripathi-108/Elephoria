import ffmpeg from "fluent-ffmpeg";
import { join, basename, resolve } from "path";
import { exec } from "child_process";
import { backendLogger } from "../utils/logger.utils.js";

export const uploadAudio = async (file) => {
	let metadata;
	let coverImageName = `http://localhost:3000/uploads/images/no-cover.png`;

	try {
		// Use ffprobe to extract metadata from the uploaded audio file
		metadata = await new Promise((resolve, reject) => {
			ffmpeg.ffprobe(file.path, (err, extractedMetadata) => {
				if (err) {
					reject({
						success: false,
						message: "Error extracting metadata",
						error: err,
					});
				} else {
					resolve(extractedMetadata);
				}
			});
		});

		const lyrics = await new Promise((resolve, reject) => {
			const ffprobeCmd = `ffprobe -i "${file.path}" -show_entries format_tags=lyrics -of json`;
			exec(ffprobeCmd, (error, stdout, stderr) => {
				if (error) {
					return reject(`Error executing ffprobe: ${error.message}`);
				}
				try {
					const parsedMetadata = JSON.parse(stdout);
					const lyrics =
						parsedMetadata.format?.tags?.lyrics ||
						"No lyrics found";

					resolve(lyrics);
				} catch (parseError) {
					reject(`Error parsing JSON: ${parseError.message}`);
				}
			});
		});

		// Append lyrics to the metadata object
		metadata.format.tags.lyrics = lyrics.format.tags.lyrics;

		// Check if there is a stream containing a cover image
		const coverStream = metadata.streams.find(
			(stream) =>
				stream.codec_name === "mjpeg" || stream.codec_type === "video"
		);

		if (coverStream) {
			// Extract the cover image if available
			const coverImagePath = join(
				resolve("./uploads/images"),
				`cover_${Date.now()}.jpg`
			);

			await new Promise((resolve, reject) => {
				ffmpeg(file.path)
					.outputOptions("-map", `0:${coverStream.index}`) // Select the cover image stream
					.save(join(coverImagePath)) // Save in uploads folder
					.on("end", () => {
						coverImageName = `http://localhost:3000/uploads/images/${basename(
							coverImagePath
						)}`;
						resolve();
					})
					.on("error", (err) => {
						reject(err);
					});
			});
		}

		return {
			success: true,
			fileName: file.filename,
			metadata: metadata,
			coverImage: coverImageName,
		};
	} catch (error) {
		return {
			success: false,
			message: "Error processing the file",
			error: error,
		};
	}
};

export const editMetadata = (metadata, inputFilePath, outputFilePath) => {
	return new Promise((resolve, reject) => {
		// Initialize the ffmpeg command with the input file path
		const command = ffmpeg(inputFilePath);

		// Loop through metadata and add options dynamically
		Object.entries(metadata).forEach(([key, value]) => {
			// Ensure value is not empty or null before appending to metadata
			if (value) {
				command.outputOptions("-metadata", `${key}=${value}`);
			} else if (value === null || value === "") {
				command.outputOptions(`-metadata`, `${key}=`);
			}
		});

		// Execute the ffmpeg command
		command
			.outputOptions("-c copy") // Copy the stream without re-encoding
			.save(outputFilePath)
			.on("end", () => {
				resolve({
					success: true,
				});
			})
			.on("error", (err) => {
				reject({
					success: false,
					message: "Error processing the file",
					error: err,
				});
			});
	});
};
