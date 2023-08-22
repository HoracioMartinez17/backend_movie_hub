import { Router } from "express";
import { getAllUsers, createUsers, updateUsers, deleteUsers, getUserById } from "../controllers/user.controllers";
import { checkJwtMiddleware } from "../middlewares/checkjwt.middleware";

const UserRouter = Router();

// Ruta para crear un nuevo usuario
UserRouter.post("/",checkJwtMiddleware, createUsers);

// Ruta para obtener todos los usuarios
UserRouter.get("/",checkJwtMiddleware, getAllUsers);

// Ruta para obtener un usuario por su ID
UserRouter.get("/:userId",checkJwtMiddleware, getUserById);

// Ruta para actualizar los datos de un usuario por su ID
UserRouter.put("/:userId",checkJwtMiddleware, updateUsers);

// Ruta para eliminar un usuario por su ID
UserRouter.delete("/:userId",checkJwtMiddleware, deleteUsers);

export default UserRouter;
