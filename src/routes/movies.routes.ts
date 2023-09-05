import { Router } from 'express';
import { getMoviesByMovieId, getAllMovies,createMovie, deleteMovie, updateMovieWithImage } from '../controllers/movies.controllers';
import { convertMovieFields } from '../middlewares/convertMovieFields';
import { checkJwtMiddleware } from '../middlewares/checkjwt.middleware';

const MoviesRouter = Router();

// Path to get all a user's movies by their ID
MoviesRouter.get('/:movieId',checkJwtMiddleware, getMoviesByMovieId);
// Path to get all movies (without filtering by user)
MoviesRouter.get('/',checkJwtMiddleware, getAllMovies);

// Path to create a new movie associated with a specific user
MoviesRouter.post('/:userId',checkJwtMiddleware, convertMovieFields,createMovie);

// Path to update details of a specific movie
 MoviesRouter.put('/:movieId',checkJwtMiddleware,convertMovieFields, updateMovieWithImage);

// Path to remove a movie from a user's list by its ID
MoviesRouter.delete('/:movieId',checkJwtMiddleware, deleteMovie);

export default MoviesRouter;