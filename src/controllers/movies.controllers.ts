import { Request, Response } from 'express';
import MoviesModel from '../models/movies.model'; // Importar el modelo de movies
import UserModel from '../models/user.model'; // Importar el modelo de usuario

// Controlador para obtener todas las películas  por su ID
export const getMoviesByUserId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Buscar la movie en la base de datos por su ID
        const movie = await MoviesModel.findById(id)
        if (!movie) {
            // Si no se encuentra la movie, devolver un mensaje de error con código 404
            return res.status(404).send({ error: 'Movie not found' });
        }

        // Devolver el array de películas
        res.send(movie);
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};

export const getAllMovies = async (req: Request, res: Response) => {
    try {
        // Buscar todas las películas en la base de datos
        const movies = await MoviesModel.find();

        // Devolver el array de películas
        res.send(movies);

} catch (err) {
    console.error(err); // Registrar el error en la consola para fines de depuración
    // En caso de error interno, devolver un mensaje de error con código 500
    res.status(500).send({ error: 'Internal server error' });
}
}


export const createMovie = async (req: Request, res: Response) => {
    const { name, year, genre, language, image, description } = req.body;
    const { userId } = req.params;

    try {


        const user = await UserModel.findById(userId);

        if(!user){
            res.status(404).send({ error: 'User not found' });
        }
        if(!name || !year  || !genre || !language || !image || !description){
            res.status(400).send({ error: 'Please provide all required fields' });
        }

        // Validar que el año sea un número
        if(isNaN(year)){
            res.status(400).send({ error: 'Year must be a number' })

        }
        // Crear una nueva instancia de la película con los datos proporcionados
        const newMovie = new MoviesModel({ name, year, genre, description, language, image });
        // Guardar la nueva película en la base de datos
        const savedMovie = await newMovie.save();

        // Actualizar el documento del usuario para agregar la nueva película a su lista de películas
        const updateMovieUser = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { movies:newMovie } }, // Agregar el ID de la nueva película a la lista de películas del usuario
            { new: true } // Devuelve el documento actualizado del usuario
        );

        // Enviar la película guardada como respuesta
        res.status(201).send({status:'success',message: 'Movie create successfully',newMovie});
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};

export const updateMovie = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, year, genre, language, image, description } = req.body;

    try {
        // Buscar la película por su ID y actualizar sus datos
        const updatedMovie = await MoviesModel.findByIdAndUpdate(
            { _id: id },
            { $set: { name, year, genre, description, language, image } },
            { new: true } // Devuelve el documento actualizado de la película
        );

        // Verificar si hubo algun error al actualizar la pelicula
        if (!updatedMovie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        // Enviar la película actualizada como respuesta
        res.status(200).send({status:'success',message: 'Movie update successfully', updatedMovie});
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};

export const deleteMovie = async (req: Request, res: Response) => {
    const { userId, movieId } = req.params; // ID del usuario y de la película

    try {
        // Eliminar la referencia de la película en la lista de películas del usuario
        const updateUser = await UserModel.updateOne(
            { _id: userId },
            { $pull: { movies: movieId } }
        );

        // Verificar si el documento del usuario fue actualizado
        if (updateUser.modifiedCount > 0) {
            // La película fue eliminada de la lista del usuario
            return res.status(200).send({ status: 'success', message: 'Movie deleted successfully' });
        } else {
            // El usuario no tenía la película en su lista
            return res.status(404).send({ status: 'error', message: 'Movie not found in user\'s list' });
        }
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};




//modelo de creacio de movies
    // "name": "Harry",
    // "year": 2902,
    // "genre": "terror",
    // "language": "español",
    // "description": "Hola como estaaas?",
    // "image": "https://image.tmdb.org/t/p/original/8ozl0nSIUy1guQuv3d0UWXyvfJm.jpg"
  
