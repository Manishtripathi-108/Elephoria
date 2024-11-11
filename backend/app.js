// app.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const path = require("path");

const app = express();

app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);

/* ------------------ Serve Static Files for Uploaded Images ---------------- */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;
