const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Conectado a la BBDD con éxito 🎉✅");
  } catch (error) {
    console.log("Error en la conexión de la BBDD", error.message);
  }
};

module.exports = { connectDB };
