import { Request, Response } from 'express';
import MoviesModel from '../models/movies.model'; // Importar el modelo de movies
import UserModel from '../models/user.model'; // Importar el modelo de usuario

// Controlador para obtener todas las películas de un usuario por su ID
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
        // Crear una nueva instancia de la película con los datos proporcionados
        const newMovie = new MoviesModel({ name, year, genre, description, language, image });

        // Guardar la nueva película en la base de datos
        const savedMovie = await newMovie.save();

        // Actualizar el documento del usuario para agregar la nueva película a su lista de películas
        const updateUser = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { movies: savedMovie._id } }, // Agregar el ID de la nueva película a la lista de películas del usuario
            { new: true } // Devuelve el documento actualizado del usuario
        );

        // Enviar la película guardada como respuesta
        res.status(201).send(savedMovie);
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

        // Verificar si la película no fue encontrada
        if (!updatedMovie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        // Enviar la película actualizada como respuesta
        res.status(200).send(updatedMovie);
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};

export const deleteMovie = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Buscar la película por su ID y eliminarla
        const deletedMovie = await MoviesModel.findByIdAndDelete(id);

        // Verificar si la película no fue encontrada
        if (!deletedMovie) {
            return res.status(404).send({ error: 'Movie not found' });
        }

        // Eliminar la referencia de la película en los usuarios que la tenían en su lista
        await UserModel.updateMany(
            { movies: id },
            { $pull: { movies: id } }
        );

        // Enviar una respuesta exitosa sin contenido
        res.status(204).send();
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};



