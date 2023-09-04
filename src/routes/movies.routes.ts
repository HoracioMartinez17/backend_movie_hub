import { Router } from 'express';
import { getMoviesByMovieId, getAllMovies,createMovie, deleteMovie, updateMovieWithImage } from '../controllers/movies.controllers';
import { convertMovieFields } from '../middlewares/convertMovieFields';
import { checkJwtMiddleware } from '../middlewares/checkjwt.middleware';

const MoviesRouter = Router();

// Ruta para obtener todas las películas de un usuario por su ID
MoviesRouter.get('/:movieId',checkJwtMiddleware, getMoviesByMovieId);
// Ruta para obtener todas las películas (sin filtrar por usuario)
MoviesRouter.get('/',checkJwtMiddleware, getAllMovies);

// Ruta para crear una nueva película asociada a un usuario específico
MoviesRouter.post('/:userId',checkJwtMiddleware, convertMovieFields,createMovie);

// Ruta para actualizar los detalles de una película específica
 MoviesRouter.put('/:movieId',checkJwtMiddleware,convertMovieFields, updateMovieWithImage);

// Ruta para eliminar una película de la lista de un usuario por su ID
MoviesRouter.delete('/:movieId',checkJwtMiddleware, deleteMovie);

export default MoviesRouter;
