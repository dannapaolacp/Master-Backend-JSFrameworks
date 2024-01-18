//Routes
"use strict";

const express = require("express");
const ArticleController = require("../controllers/article");

const router = express.Router();

//configure connect multiparty
const multipart = require("connect-multiparty");
const md_upload = multipart({ uploadDir: "./upload/articles" });

//test routes
router.post("/course-data", ArticleController.CourseData);
router.get("/controller-test", ArticleController.test);

//routes for articles
router.post("/save", ArticleController.save);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.put("/article/:id/update", ArticleController.update);
router.delete("/article/:id/delete", ArticleController.delete);
//route to which the middleware is applied
router.post("/upload-image/:id", md_upload, ArticleController.upload);
//route to getImge
router.get("/get-image/:image", ArticleController.getImage);
//route to search image
router.get("/search/:search", ArticleController.search);

module.exports = router;
