import {Router} from "express";
import {createGenre, getAllGenres,getMoviesByGenreAndUser } from "../controllers/genre.controllers";

const GenreRouter = Router()

GenreRouter
    .post("/", createGenre)
    .get("/:genreName/:userId", getMoviesByGenreAndUser )
    .get("/", getAllGenres)


export default GenreRouter