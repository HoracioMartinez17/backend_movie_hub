import { Request, Response } from 'express';
import MoviesModel from '../models/movies.model'; // Import the movies model
import UserModel from '../models/user.model'; // Import the user model

// Controller to get movies by their ID
export const getMoviesByUserId = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        // Find the movie in the database by its ID
        const movie = await MoviesModel.findById(id);
        if (!movie) {
            // If the movie is not found, return an error message with status code 404
            return res.status(404).send({ status: 'error', error: 'Movie not found' });
        }

        // Return the movie array
        res.send(movie);
    } catch (err) {
        console.error(err); // Log the error to the console for debugging purposes
        // In case of an internal error, return an error message with status code 500
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
};

export const getAllMovies = async (req: Request, res: Response) => {
    try {
        // Find all movies in the database
        const movies = await MoviesModel.find();

        // Return the array of movies
        res.send(movies);
    } catch (err) {
        console.error(err); // Log the error to the console for debugging purposes
        // In case of an internal error, return an error message with status code 500
        res.status(500).send({ error: 'Internal server error' });
    }
}

export const createMovie = async (req: Request, res: Response) => {
    const { name, year, genre, language, image, description } = req.body;
    const { userId } = req.params;

    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).send({ status: 'error', error: 'User not found' });
        }
        if (!name || !year || !genre || !language || !image || !description) {
            return res.status(400).send({ error: 'Please provide all required fields' });
        }


        // Create a new movie instance with the provided data
        const newMovie = new MoviesModel({ name, year, genre, description, language, image });
        // Save the new movie to the database
        const savedMovie = await newMovie.save();

        // Update the user document to add the new movie to their list of movies
        const updateMovieUser = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { movies: newMovie } }, // Add the ID of the new movie to the user's list of movies
            { new: true } // Return the updated user document
        );

        // Send the saved movie as a response
        res.status(201).send({ status: 'success', message: 'Movie created successfully', newMovie });
    } catch (err) {
        console.error(err); // Log the error to the console for debugging purposes
        // In case of an internal error, return an error message with status code 500
        res.status(500).send({ error: 'Internal server error' });
    }
};

export const updateMovie = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, year, genre, language, image, description } = req.body;

    try {
        // Find the movie by its ID and update its data
        const updatedMovie = await MoviesModel.findByIdAndUpdate(
            { _id: id },
            { $set: { name, year, genre, description, language, image } },
            { new: true } // Return the updated movie document
        );

        // Check if there was an error while updating the movie
        if (!updatedMovie) {
            return res.status(404).send({ status: 'error', error: 'Movie not found' });
        }

        // Send the updated movie as a response
        res.status(200).send({ status: 'success', message: 'Movie updated successfully', updatedMovie });
    } catch (err) {
        console.error(err); // Log the error to the console for debugging purposes
        // In case of an internal error, return an error message with status code 500
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
};

export const deleteMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params; // ID of the movie to be deleted

    try {
        // Find the movie by its ID and delete it
        const deletedMovie = await MoviesModel.findByIdAndDelete(movieId);

        // Check if the movie was deleted
        if (!deletedMovie) {
            return res.status(404).send({ status: 'error', message: 'Movie not found' });
        }

        // Remove the movie reference from users who had it in their list
        const updateUser = await UserModel.updateMany(
            { movies: movieId },
            { $pull: { movies: movieId } }
        );

        // Send a successful response with no content
        res.status(204).send({ status: 'success', message: 'Movie deleted successfully' });
    } catch (err) {
        console.error(err); // Log the error to the console for debugging purposes
        // In case of an internal error, return an error message with status code 500
        res.status(500).send({ error: 'Internal server error' });
    }
};
