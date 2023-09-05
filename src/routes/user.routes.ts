import { Router } from "express";
import { getAllUsers, createUsers, updateUsers, deleteUsers, getUserById } from "../controllers/user.controllers";

const UserRouter = Router();

// Route to create a new user
UserRouter.post("/", createUsers);

// Route to get all users
UserRouter.get("/", getAllUsers);

// Route to get a user by their ID
UserRouter.get("/:userId", getUserById);

// Route to update a user's data by their ID
UserRouter.put("/:userId", updateUsers);

// Route to delete a user by their ID
UserRouter.delete("/:userId", deleteUsers);

export default UserRouter;
