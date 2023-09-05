import {Router} from "express";
import {createGenre, getAllGenres,getMoviesByGenreAndUser, deleteGenre,updateGenre } from "../controllers/genre.controllers";
import { checkJwtMiddleware } from "../middlewares/checkjwt.middleware";

const GenreRouter = Router()

GenreRouter
    .post("/",checkJwtMiddleware, createGenre)
    .put("/:genreName/:id",checkJwtMiddleware, updateGenre )
    .get("/:genreName/:userId",checkJwtMiddleware, getMoviesByGenreAndUser )
    .get("/:userId",checkJwtMiddleware, getAllGenres)
    .delete("/:genreName/:id",checkJwtMiddleware, deleteGenre )


export default GenreRouter