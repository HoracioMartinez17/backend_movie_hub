import { Router } from 'express';
import { getMoviesByUserId, getAllMovies, createMovie, updateMovie, deleteMovie } from '../controllers/movies.controllers';
import { convertMovieFields } from '../middlewares/convertMovieFields';

const MoviesRouter = Router();

// Route to get all movies by user ID
MoviesRouter.get('/:id', getMoviesByUserId);

// Route to get all movies (unfiltered by user)
MoviesRouter.get('/', getAllMovies);

// Route to create a new movie associated with a specific user
MoviesRouter.post('/:userId', convertMovieFields, createMovie);

// Route to update the details of a specific movie
MoviesRouter.put('/:id', convertMovieFields, updateMovie);

// Route to delete a movie from a user's list by movie ID
MoviesRouter.delete('/:movieId', deleteMovie);

export default MoviesRouter;
