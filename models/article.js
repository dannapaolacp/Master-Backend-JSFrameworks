//model for app
"use strict";

const mongoose = require("mongoose");

//article model
var ArticleSchema = new mongoose.Schema({
  title: { type: String },
  content: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
  image: { type: String },
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
//articles --> Save documents of this type and with this structure within the collection
