require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const userRoutes = require("./src/api/routes/userRoutes");
const bookRoutes = require("./src/api/routes/bookRoutes");

const app = express();
connectDB();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/books", bookRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor levantado en: http://localhost:${PORT}`);
});
