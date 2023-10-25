import { Router } from "express";
import { getAllUsers, createUsers, updateUsers, deleteUsers, getUserById } from "../controllers/user.controllers";
import { checkJwtMiddleware } from "../middlewares/checkjwt.middleware";

const UserRouter = Router();

// Path to create a new user
UserRouter.post("/",createUsers);

// Path to get all users
UserRouter.get("/",checkJwtMiddleware, getAllUsers);

// Route to get a user by their ID
UserRouter.get("/:userId",checkJwtMiddleware, getUserById);

// Route to update a user's data by their ID
UserRouter.put("/:userId", updateUsers);

// Path to delete a user by their ID
UserRouter.delete("/:userId", deleteUsers);

export default UserRouter;
