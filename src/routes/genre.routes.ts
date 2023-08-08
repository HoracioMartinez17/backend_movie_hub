import {Router} from "express";
import {createGenre, getAllGenres} from "../controllers/genre.controllers";

const GenreRouter = Router()

GenreRouter
    .post("/", createGenre)
    .get("/", getAllGenres)


export default GenreRouter