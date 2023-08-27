import {Router} from "express";
import {createGenre, getAllGenres,getMoviesByGenreAndUser } from "../controllers/genre.controllers";
import { checkJwtMiddleware } from "../middlewares/checkjwt.middleware";

const GenreRouter = Router()

GenreRouter
    .post("/",checkJwtMiddleware, createGenre)
    .get("/:genreName/:userId",checkJwtMiddleware, getMoviesByGenreAndUser )
    .get("/:userId",checkJwtMiddleware, getAllGenres)


export default GenreRouter