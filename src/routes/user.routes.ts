import {Router} from "express";
import { getAllUsers, createUsers, updateUsers, deleteUsers } from "../controllers/user.controllers";

const UserRoutes = Router();

UserRoutes
.post("/", createUsers)
.get("/", getAllUsers)
.put("/:id", updateUsers)
.delete("/:ID", deleteUsers);


export default UserRoutes;