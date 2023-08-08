import { Request, Response } from 'express';
import prisma from '../db/clientPrisma' // // Importar el modelo de movies


// Controlador para crear una nueva pelicula
export const createMovie = async (req: Request, res: Response) => {
    const { name, year, description, language, image, genres } = req.body;
    const { userId } = req.params;
    const { genrerId } = req.params;

    try {
        // Validar que se proporcionaron todos los campos requeridos
        if (!name || !year || !genres || !language || !image || !description) {
            return res.status(400).send({ error: 'Please provide all required fields' });
        }

        // Validar que el año sea un número
        if (isNaN(year)) {
            return res.status(400).send({ status: 'error', error: 'Year must be a number' });
        }

        const genreIDs: string[] = [];

        // Loop through the genres array to check if they exist or create them if needed
        for (const genreName of genres) {
            let genre = await prisma.genres.findFirst({ where: { name: genreName } });
          if (!genre) {
            genre = await prisma.genres.create({ data: { name: genreName } });
          }
    
          genreIDs.push(genre.id);
        }
    


        // Crear una nueva instancia de la película con los datos proporcionados
        const newMovie = await prisma.movies.create({
            data: {
                name,
                year,
                description,
                language,
                image,
                genres: {
                    connect: genreIDs.map((genreId: string) => ({ id:  genreId})),
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


// Controlador para obtener las películas  por su ID
export const getMoviesByMovieId = async (req: Request, res: Response) => {
    const { movieId } = req.params;

    try {
        // Buscar la movie en la base de datos por su ID
        const movie = await prisma.movies.findUnique({where:{id: movieId},include:{genres:true}})
        if (!movie) {
            // Si no se encuentra la movie, devolver un mensaje de error con código 404
            return res.status(404).send({ status: 'error', error: 'Movie not found' });
        }

        // Devolver el array de películas
        res.status(200).send({status: 'success', movie});
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ status: 'error', error: 'Internal server error'});
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
            name: true,
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



// Controlador para obtener películas por género
// export const getMoviesByGenre = async (req: Request, res: Response) => {
//     const { genre, page, limit } = req.query;

//     try {
//         const options = {
//             page: parseInt(page as string, 10) || 1,
//             limit: parseInt(limit as string, 10) || 10,
//         };

//         // Buscar películas por género utilizando paginate
//         const result = await MoviesModel.Pagination({ genres: genre }, options);

//         res.json(result);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };


// Controlador para actualizar las películas
// export const updateMovie = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const { name, year, genre, language, image, description } = req.body;

//     try {
//         // Buscar la película por su ID y actualizar sus datos
//         const updatedMovie = await MoviesModel.findByIdAndUpdate(
//             { _id: id },
//             { $set: { name, year, genre, description, language, image } },
//             { new: true } // Devuelve el documento actualizado de la película
//         );

//         // Verificar si hubo algun error al actualizar la pelicula
//         if (!updatedMovie) {
//             return res.status(404).send({ status: 'error', error: 'Movie not found' });
//         }

//         // Enviar la película actualizada como respuesta
//         res.status(200).send({status:'success',message: 'Movie update successfully', updatedMovie});
//     } catch (err) {
//         console.error(err); // Registrar el error en la consola para fines de depuración
//         // En caso de error interno, devolver un mensaje de error con código 500
//         res.status(500).send({ status: 'error', error: 'Internal server error'});
//     }
// };

// Controlador para eliminar una pelicula
export const deleteMovie = async (req: Request, res: Response) => {
    const { movieId } = req.params; // ID de la película que se eliminará

    try {
        // Buscar la película por su ID y eliminarla
        const deletedMovie = await prisma.movies.delete({where:{id: movieId}});

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





//modelo de creacio de movies
    // "name": "Harry",
    // "year": 2902,
    // "genre": "terror",
    // "language": "español",
    // "description": "Hola como estaaas?",
    // "image": "https://image.tmdb.org/t/p/original/8ozl0nSIUy1guQuv3d0UWXyvfJm.jpg"
  
