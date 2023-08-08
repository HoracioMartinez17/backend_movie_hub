import { Router } from "express";
import { getAllUsers, createUsers, updateUsers, deleteUsers, getUserById } from "../controllers/user.controllers";

const UserRouter = Router();

// Ruta para crear un nuevo usuario
UserRouter.post("/", createUsers);

// Ruta para obtener todos los usuarios
UserRouter.get("/", getAllUsers);

// Ruta para obtener un usuario por su ID
UserRouter.get("/:userId", getUserById);

// Ruta para actualizar los datos de un usuario por su ID
UserRouter.put("/:userId", updateUsers);

// Ruta para eliminar un usuario por su ID
UserRouter.delete("/:userId", deleteUsers);

export default UserRouter;
