require("dotenv").config();
const mongoose = require("mongoose");
const { seedBooks } = require("./seedsBooks");
const { seedUsers } = require("./seedsUsers");
const { seedReviews } = require("./seedsReviews");

const wait = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const runSeeds = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("MongoDb conectado correctamente 💾");

    await seedUsers();
    await wait(500);
    await seedBooks();
    await wait(500);
    await seedReviews(); // Última porque necesita el id de books y users

    console.log("Seeds completados ✅🎉");
  } catch (error) {
    console.log("Error en los seeds", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB desconectado 🔌❌");
  }
};

runSeeds();
