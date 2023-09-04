import { Request, Response } from 'express';
import prisma from '../db/clientPrisma'
import { uploadImage } from "../utils/cloudinary";
import fs from 'fs-extra'


// Controlador para crear una nueva pelicula
export const createMovie = async (req: Request, res: Response) => {
    let { title, year, description, language, genre } = req.body;
    const { userId } = req.params;

    let secure_url_image: string = '';
    let public_id_image: string = '';



    try {
        const uploadedImage = req.files?.image;


        // Verificar si uploadedImage existe y no es un array
        if (uploadedImage === undefined || Array.isArray(uploadedImage)) {
            console.log('Invalid or missing image');
            return res.status(400).json('Invalid or missing image');
        }

        // Verificar si 'tempFilePath' está presente en uploadedImage
        if (!('tempFilePath' in uploadedImage)) {
            console.log('Missing tempFilePath');
            return res.status(400).send('Missing tempFilePath');
        }

        // Subir la imagen a Cloudinary
        const image = await uploadImage(uploadedImage.tempFilePath);
        public_id_image = image.public_id;
        secure_url_image = image.secure_url;

        // Eliminar el archivo temporal
        await fs.unlink(uploadedImage.tempFilePath);


        // Crear una nueva instancia de la película con los datos proporcionados
        const newMovie = await prisma.movies.create({
            data: {
                title,
                year,
                description,
                language,
                image: {
                    create: {
                        public_id: public_id_image,
                        secure_url: secure_url_image,
                    },
                },
                genre: {
                    connect: { id: genre },
                },
                User: {
                    connect: {
                        id: userId,
                    },
                },
            },
            select: {
                title: true,
                year: true,
                description: true,
                language: true,
                image: {
                    select: {
                        public_id: true,
                        secure_url: true,
                    },
                },
                genre: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        // Enviar la película guardada como respuesta
        res.status(201).send({ status: 'success', message: 'Movie created successfully', newMovie });

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};



//controlador para actualizar las peliculas
export const updateMovieWithImage = async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const { title, description, language, year, genre } = req.body;

    try {
        // Obtener la película existente por su ID
        const existingMovie = await prisma.movies.findUnique({
            where: { id: movieId },
        });

        // Si no se encontró la película, devolver un error 404
        if (!existingMovie) {
            return res.status(404).send({ status: 'error', message: 'Movie not found' });
        }

        // Crear un objeto de datos con los campos proporcionados en la solicitud
        const updatedData: any = {}; // Define las propiedades necesarias y sus tipos

        if (title !== undefined) {
            updatedData.title = title;
        }

        if (description !== undefined) {
            updatedData.description = description;
        }

        if (language !== undefined) {
            updatedData.language = language;
        }

        if (year !== undefined) {
            updatedData.year = year;
        }

        if (genre !== undefined) {
            updatedData.genre = { connect: { id: genre } };
        }

        // Actualizar la película con los campos proporcionados
        const updatedMovie = await prisma.movies.update({
            where: { id: movieId },
            data: updatedData,
        });

        // Cargar la nueva imagen (si se proporciona) y actualizar la referencia de la imagen en la base de datos
        const uploadedImage = req.files?.image;
        if (uploadedImage && 'tempFilePath' in uploadedImage) {
            try {
                // Subir la nueva imagen
                const posterImage = await uploadImage(uploadedImage.tempFilePath);

                // Actualizar la referencia de la imagen en la base de datos
                await prisma.movies.update({
                    where: { id: movieId },
                    data: {
                        image: {
                            update: {
                                public_id: posterImage.public_id,
                                secure_url: posterImage.secure_url,
                            },
                        },
                    },
                });

                // Eliminar el archivo temporal de la nueva imagen
                await fs.unlink(uploadedImage.tempFilePath);
            } catch (error) {
                return res.status(500).json({ error: 'Upload error' });
            }
        }

        // Devolver una respuesta 200 que indica que la actualización ha sido exitosa
        res.status(200).send({ status: 'success', message: 'Movie updated successfully', updatedMovie });
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};



// Controlador para obtener las películas  por su ID
export const getMoviesByMovieId = async (req: Request, res: Response) => {
    const { movieId } = req.params;

    try {
        // Buscar la movie en la base de datos por su ID
        const movie = await prisma.movies.findUnique({
            where: { id: movieId },
            select: {
                id: true,
                title: true,
                year: true,
                language: true,
                description: true,
                image: true,
                genre: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if (!movie) {
            // Si no se encuentra la movie, devolver un mensaje de error con código 404
            return res.status(404).send({ status: 'error', error: 'Movie not found' });
        }

        // Devolver el array de películas
        res.status(200).send({ status: 'success', movie });
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
};


// Controlador para obtener todas las peliculas
export const getAllMovies = async (req: Request, res: Response) => {
    const pageSize = 4; // Número de películas por página
    const currentPage = req.query.page ? parseInt(req.query.page.toString()) : 1; // Página actual

    try {
        // Calcular el índice de inicio para saltar registros
        const skip = (currentPage - 1) * pageSize;

        // Buscar películas en la base de datos con paginación y campos seleccionados
        const movies = await prisma.movies.findMany({
            skip,
            take: pageSize,
            select: {
                title: true,
                year: true,
                description: true,
                language: true,
                image: true,
                genre: true,
            },
        })
        // Contar todas las películas para calcular el total de páginas
        const totalMovies = await prisma.movies.count();

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalMovies / pageSize);

        // Devolver la lista de películas y la información de paginación
        res.status(200).send({
            status: 'success',
            data: movies,
            pagination: {
                currentPage,
                pageSize,
                totalMovies,
                totalPages,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
};


// Controlador para eliminar una pelicula
export const deleteMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params; // ID de la película que se eliminará

    try {
        // Buscar la película por su ID y eliminarla
        const deletedMovie = await prisma.movies.delete({ where: { id: movieId } });

        // Verificar si la película fue eliminada
        if (!deletedMovie) {
            return res.status(404).send({ status: 'error', message: 'Movie not found' });
        }


        // Enviar una respuesta exitosa sin contenido
        res.status(204).send({ status: 'success', message: 'Movie deleted successfully' });
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};

// //modelo de creacio de movies
// {
//     "title": "Nombre de la película",
//     "year": 2023,
//     "description": "Descripción de la película",
//     "language": "Idioma de la película",
//     "image": "URL de la imagen",
//     "genres": "id del género al que quiere relacionar la movie"
//   }

