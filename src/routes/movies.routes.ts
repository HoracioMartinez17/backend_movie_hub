import { Router } from 'express';
import { getMoviesByUserId, getAllMovies,createMovie, updateMovie, deleteMovie } from '../controllers/movies.controllers';

const MoviesRouter = Router();

// Ruta para obtener todas las películas de un usuario por su ID
MoviesRouter.get('/:id', getMoviesByUserId);
// Ruta para obtener todas las películas (sin filtrar por usuario)
MoviesRouter.get('/', getAllMovies);

// Ruta para crear una nueva película asociada a un usuario específico
MoviesRouter.post('/:userId', createMovie);

// Ruta para actualizar los detalles de una película específica
MoviesRouter.put('/:id', updateMovie);

// Ruta para eliminar una película específica
MoviesRouter.delete('/:id', deleteMovie);

export default MoviesRouter;
