import ffmpeg from "fluent-ffmpeg";
import { join, basename, resolve } from "path";
import { exec } from "child_process";
import { backendLogger } from "../utils/logger.utils.js";

export const uploadAudio = async (file) => {
	let metadata;
	let coverImageName = `http://localhost:3000/uploads/images/no-cover.png`;

	try {
		// Extract metadata from the uploaded audio file
		metadata = await new Promise((resolve, reject) => {
			ffmpeg.ffprobe(file.path, (err, extractedMetadata) => {
				if (err) {
					return reject({
						success: false,
						message: "Error extracting metadata",
						error: err,
					});
				}
				resolve(extractedMetadata);
			});
		});

		// Extract lyrics
		const lyrics = await new Promise((resolve, reject) => {
			const ffprobeCmd = `ffprobe -i "${file.path}" -show_entries format_tags=lyrics -of json`;
			exec(ffprobeCmd, (error, stdout) => {
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
		metadata.format.tags.lyrics = lyrics;

		// Check for a cover image stream
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
					.save(coverImagePath) // Save in uploads folder
					.on("end", () => {
						coverImageName = `http://localhost:3000/uploads/images/${basename(
							coverImagePath
						)}`;
						resolve();
					})
					.on("error", (err) => {
						console.warn("Error extracting cover image:", err);
						resolve(); // Continue without rejecting
					});
			});
		}

		return {
			success: true,
			fileName: file.filename,
			metadata,
			coverImage: coverImageName,
		};
	} catch (error) {
		return {
			success: false,
			message: "Error processing the file",
			error,
		};
	}
};

export const editMetadata = (metadata, inputFilePath, outputFilePath) => {
	return new Promise((resolve, reject) => {
		const command = ffmpeg(inputFilePath);
		backendLogger.info("Metadata: ", metadata);

		Object.entries(metadata).forEach(([key, value]) => {
			command.outputOptions("-metadata", `${key}=${value || ""}`);
		});

		command
			.outputOptions("-c copy") // Copy the stream without re-encoding
			.save(outputFilePath)
			.on("end", () => resolve({ success: true }))
			.on("error", (err) =>
				reject({
					success: false,
					message: "Error processing the file",
					error: err,
				})
			);
	});
};
