const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error de conexión a MongoDB:"));
db.once("open", function () {
  console.log("Conexión exitosa a MongoDB");
});

// Definir el esquema de usuario
const userSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  edad: Number,
});

// Definir el modelo de usuario
const User = mongoose.model("User", userSchema);

// Configurar Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rutas
// Obtener todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo usuario
app.post("/api/usuarios", async (req, res) => {
  const user = new User({
    nombre: req.body.nombre,
    email: req.body.email,
    edad: req.body.edad,
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un usuario existente
app.put("/api/usuarios/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndUpdate(id, req.body);
    res.json({ message: "Usuario actualizado correctamente" });
  } catch (err) {
    res.status(404).json({ message: "No se encontró el usuario" });
  }
});

// Eliminar un usuario
app.delete("/api/usuarios/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(404).json({ message: "No se encontró el usuario" });
  }
});

// Iniciar el servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
