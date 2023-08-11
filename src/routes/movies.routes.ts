import { Router } from 'express';
import { getMoviesByMovieId, getAllMovies,createMovie, deleteMovie, updateMovie } from '../controllers/movies.controllers';
import { convertMovieFields } from '../middlewares/convertMovieFields';

const MoviesRouter = Router();

// Ruta para obtener todas las películas de un usuario por su ID
MoviesRouter.get('/:movieId', getMoviesByMovieId);
// Ruta para obtener todas las películas (sin filtrar por usuario)
MoviesRouter.get('/', getAllMovies);

// Ruta para crear una nueva película asociada a un usuario específico
MoviesRouter.post('/:userId',convertMovieFields, createMovie);

// Ruta para actualizar los detalles de una película específica
 MoviesRouter.put('/:movieId',convertMovieFields, updateMovie);

// Ruta para eliminar una película de la lista de un usuario por su ID
MoviesRouter.delete('/:movieId', deleteMovie);

export default MoviesRouter;
