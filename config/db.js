//database connection
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/api_rest_blog")
  .then(() => {
    console.log("La conexión a la base de datos se ha realizado correctamente");
  })
  .catch((error) => {
    console.error("Error de conexión a la base de datos:", error.message);
  });

module.exports = mongoose.connection;
