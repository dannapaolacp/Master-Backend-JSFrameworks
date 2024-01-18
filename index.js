// For good practices
"use strict";

// imports
const mongoose = require("mongoose");
const db = require("./config/db");

//use app module
var app = require("./app");
var port = 3900;

// promises to avoid errors
// mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

// event handling for database connection
db.on(
  "error",
  console.error.bind(console, "Error de conexión a la base de datos:")
);
db.once("open", () => {
  console.log("La conexión a la base de datos se ha realizado correctamente");
  // create server and listen to HTTP requests
  app.listen(port, () => {
    console.log("Servidor corriendo en HTTP://localhost:" + port);
  });
});
