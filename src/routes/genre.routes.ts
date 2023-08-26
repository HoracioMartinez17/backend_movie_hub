import {Router} from "express";
import {createGenre, getAllGenres,getMoviesByGenreAndUser } from "../controllers/genre.controllers";
import { checkJwtMiddleware } from "../middlewares/checkjwt.middleware";

const GenreRouter = Router()

GenreRouter
    .post("/", createGenre)
    .get("/:genreName/:userId",checkJwtMiddleware, getMoviesByGenreAndUser )
    .get("/:userId", getAllGenres)


export default GenreRouter