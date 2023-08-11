import { Request, Response } from 'express';
import prisma from '../db/clientPrisma' // // Importar el modelo de movies


// Controlador para crear una nueva pelicula
export const createMovie = async (req: Request, res: Response) => {
    const { title, year, description, language, image, genres } = req.body;
    const { userId } = req.params;

    try {

        const genreIDs: string[] = [];

        // Iterar el array de géneros para verificar si existen o crearlos si es necesario
        for (const genretitle of genres) {
            let genre = await prisma.genres.findFirst({ where: { name: genretitle } });
            if (!genre) {
                genre = await prisma.genres.create({ data: { name: genretitle } });
            }
            genreIDs.push(genre.id);
        }

        // Crear una nueva instancia de la película con los datos proporcionados
        const newMovie = await prisma.movies.create({
            data: {
                title,
                year,
                description,
                language,
                image,
                genres: {
                    connect: genreIDs.map((genreId: string) => ({ id: genreId })),
                },
                User: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });

        // Enviar la película guardada como respuesta
        res.status(201).send({ status: 'success', message: 'Movie created successfully', newMovie });
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};

//controlador para actualizar las peliculas
export const updateMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params;
    const { title, description, image, language, year, genres } = req.body;

    try {

        const genresIDs: string[] = []

        // Iterar el array de géneros para verificar si existen, si no existe lo cramos, si ya existe, lo actualizamos
        for (const genresName of genres) {
            let genre = await prisma.genres.findFirst({ where: { name: genresName } });
            if (!genre) {
                genre = await prisma.genres.create({
                  data: { name: genresName }
                });
            } else {
                genre = await prisma.genres.update({
                  where: { id: genre.id },
                  data: { name: genresName }
                });
            }


            genresIDs.push(genre.id);
        }

        // Actualizar la pelicula por su id
        const updatedMovie = await prisma.movies.update({
            where: { id: movieId },
            data: { title, description, year, image, language,
                // Actualizar los generos de la película
                genres: { connect: genresIDs.map(genreId => ({ id: genreId })) } }
                ,include: {genres: true}});

        // Si no se encontró la película, devolver un error 404
        if (!updatedMovie) {
            return res.status(404).send({ status: 'error', message: 'Movie not found' });
        }

        // Devolver una espuesta 201 que indica que la creación ha sido exitosa
        res.status(201).send({ status: 'success', message: 'Movie updated successfully', updatedMovie });


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
        const movie = await prisma.movies.findUnique({ where: { id: movieId }, include: { genres: true } })
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
    const pageSize = 10; // Número de películas por página
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
                genres: true,
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
//     "genres": ["Nombre del género 1"]
//   }

