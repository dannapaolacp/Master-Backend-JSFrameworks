// For good practices
"use strict";

//Load node modules to create server
const express = require("express");

//Run express (http)
const app = express();

//Load file paths
const ArticleRoutes = require("./routes/article");

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Load CORS to allow request from the Frontend

//Add prefixes to routes / Load routes
app.use("/api", ArticleRoutes);

// Route or example method

// app.get("/course-data", (req, res) => {
//   return res.status(200).send({
//     course: "Master en Frameworks JS",
//     author: "Danna Capera",
//     url: "dannacaperaweb.es",
//   });
// });

// app.post("/course-data", (req, res) => {
//   var hi = req.body.hi;
//   return res.status(200).send({
//     course: "Master en Frameworks JS",
//     author: "Danna Capera",
//     url: "dannacaperaweb.es",
//     hi,
//   });
// });

//Export module (current file)
module.exports = app;
