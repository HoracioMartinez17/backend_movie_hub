import {Router} from "express";
import {createGenre, getAllGenres,getMoviesByGenreAndUser, deleteGenre,updateGenre } from "../controllers/genre.controllers";
import { checkJwtMiddleware } from "../middlewares/checkjwt.middleware";

const GenreRouter = Router()

GenreRouter
    .post("/",checkJwtMiddleware, createGenre)
    .put("/:genreName/:userId",checkJwtMiddleware, updateGenre )
    .get("/:genreName/:userId",checkJwtMiddleware, getMoviesByGenreAndUser )
    .get("/:userId",checkJwtMiddleware, getAllGenres)
    .delete("/:genreName/:userId",checkJwtMiddleware, deleteGenre )


export default GenreRouter