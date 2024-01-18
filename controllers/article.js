//API object
"use strict";

var validator = require("validator");
//To delete files
var fs = require("fs");
//path module
var path = require("path");

var Article = require("../models/article");

//object
var controller = {
  CourseData: (req, res) => {
    var hi = req.body.hi;
    return res.status(200).send({
      course: "Master en Frameworks JS",
      author: "Danna Capera",
      url: "dannacaperaweb.es",
      hi,
    });
  },
  test: (req, res) => {
    return res.status(200).send({
      message: "Soy la acción test de mi controlador de articulos",
    });
  }, //end controller
  save: (req, res) => {
    //collect parameters per post
    var params = req.body;

    //validate data
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
    } catch (error) {
      return res.status(200).send({
        status: "error",
        message: "Datos faltantes",
      });
    }

    if (validate_title && validate_content) {
      //create object to save
      var article = new Article();

      //assign values
      article.title = params.title;
      article.content = params.content;
      article.image = null;

      //save the article on DB
      article
        .save()
        .then((articleStored) => {
          if (!articleStored) {
            return res.status(404).send({
              status: "error",
              message: "El artículo no se ha guardado",
            });
          } else {
            return res.status(200).send({
              status: "success",
              article: articleStored,
            });
          }
        })
        .catch((err) => {
          return res.status(500).send({
            status: "error",
            message: "Error al guardar el artículo",
            error: err.message,
          });
        });
    } else {
      return res.status(200).send({
        status: "error",
        message: "Los datos no son válidos",
      });
    }
  },
  getArticles: async (req, res) => {
    var query = Article.find({});
    var last = req.params.last;
    if (last || last != undefined) {
      query.limit(5);
    }
    try {
      const articles = await query.sort("-_id").exec();

      if (!articles || articles.length === 0) {
        return res.status(404).send({
          status: "error",
          message: "No hay artículos para mostrar",
        });
      }

      return res.status(200).send({
        status: "success",
        articles,
      });
    } catch (error) {
      return res.status(500).send({
        status: "error",
        message: "Error al devolver los artículos",
        error: error.message,
      });
    }
  },
  getArticle: (req, res) => {
    //collect id from the URL
    var articleId = req.params.id;

    //Validate if it exists
    if (!articleId || articleId == null) {
      return res.status(404).send({
        status: "error",
        message: "No existe el articulo",
        error: error.message,
      });
    }
    //search the article
    Article.findById(articleId)
      .then((article) => {
        if (!article) {
          return res.status(404).send({
            status: "error",
            message: "No existe el artículo",
          });
        }
        //return JSON
        return res.status(200).send({
          status: "success",
          article,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          status: "error",
          message: "Error al devolver los datos",
          error: err.message,
        });
      });
  },
  update: (req, res) => {
    //Collect id of the article from the URL
    var articleId = req.params.id;

    //Collect data from input
    var params = req.body;

    //Validate data
    try {
      var validateTitle = !validator.isEmpty(params.title);
      var validateContent = !validator.isEmpty(params.content);
    } catch (err) {
      return res.status(200).send({
        status: "error",
        message: "Faltan datos por enviar",
        error: err.message,
      });
    }

    if (validateTitle && validateContent) {
      //Find and update
      Article.findOneAndUpdate({ _id: articleId }, params, { new: true })
        .then((articleUpdated) => {
          if (!articleUpdated) {
            return res.status(404).send({
              status: "error",
              message: "No existe el articulo",
            });
          }
          return res.status(200).send({
            status: "success",
            article: articleUpdated,
          });
        })
        .catch((err) => {
          return res.status(500).send({
            status: "error",
            message: "Error al actualizar",
            error: err.message,
          });
        });
    } else {
      //Return answer
      return res.status(200).send({
        status: "error",
        message: "La validacion no es correcta",
      });
    }
  },
  delete: (req, res) => {
    //Collect id or the article from the URL
    var articleId = req.params.id;

    //Find and delete
    Article.findOneAndDelete({ _id: articleId })
      .then((articleRemoved) => {
        if (!articleRemoved) {
          return res.status(404).send({
            status: "error",
            message: "No se elimino el articulo, posiblemente no existe",
          });
        }
        return res.status(200).send({
          status: "success",
          article: articleRemoved,
        });
      })
      .catch((err) => {
        if (err) {
          return res.status(200).send({
            status: "error",
            message: "Error al eliminar articulo",
          });
        }
      });
  },
  upload: (req, res) => {
    //configure the connect multiparty module in routes/article.js

    //Collect the request file
    let file_name = "Imagen no subida...";

    if (!req.files) {
      return res.status(404).send({
        status: "error",
        message: file_name,
      });
    }

    //Collect file name and extension
    let file_path = req.files.file0.path;
    let file_split = file_path.split("\\");

    //WARNING on linux or mac
    //let file_split = file_path.split("/");

    //File name
    file_name = file_split[2];

    //File extension
    let extension_split = file_name.split(".");
    let file_extension = extension_split[1];

    //Check the extension, only images, if it is not valid delete the file
    if (
      file_extension != "png" &&
      file_extension != "jpg" &&
      file_extension != "jpeg" &&
      file_extension != "gif"
    ) {
      //delete file
      fs.unlink(file_path, (err) => {
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error al intentar eliminar el archivo",
          });
        }

        return res.status(200).send({
          status: "error",
          message: "La extensión de la imagen no es válida",
        });
      });
    } else {
      //If all is validate
      let articleId = req.params.id;
      //Search article, asign image name and update
      Article.findOneAndUpdate(
        { _id: articleId },
        { image: file_name },
        { new: true }
      )
        .then((articleUpdated) => {
          return res.status(200).send({
            status: "success",
            articleUpdated,
          });
        })
        .catch((err) => {
          return res.status(500).send({
            status: "error",
            message: "Error al actualizar el artículo",
            error: err.message,
          });
        });
    }
  },
  getImage: (req, res) => {
    //Collect de request file
    let file = req.params.image;

    //Collect complete path
    let path_file = "./upload/articles/" + file;

    //validate if exists
    fs.exists(path_file, (exists) => {
      console.log(exists);
      if (exists) {
        return res.sendFile(path.resolve(path_file));
      } else {
        return res.status(200).send({
          status: "error",
          message: "La imagen no existe",
        });
      }
    });
  },
  search: (req, res) => {
    //Get the string to search
    let searchString = req.params.search;
    //Find or
    Article.find({
      $or: [
        //if the searchString is within the title ot content then it will list the articles
        { title: { $regex: searchString, $options: "i" } },
        { content: { $regex: searchString, $options: "i" } },
      ],
    })
      .sort([["date", "descending"]])
      .exec()
      .then((articles) => {
        if (!articles || articles.length <= 0) {
          return res.status(404).send({
            status: "error",
            message: "No hay articulos que coincidan con tu busqueda",
          });
        }
        return res.status(200).send({
          status: "success",
          articles,
        });
      })
      .catch((err) => {
        return res.status(500).send({
          status: "error",
          message: "Error en la petición",
        });
      });
  },
};

module.exports = controller;
