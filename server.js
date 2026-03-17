require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");

const app = express();
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en: http://localhost:${PORT}`);
});
