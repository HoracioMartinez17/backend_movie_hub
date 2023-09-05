import { Request, Response } from "express";
import {prismaClient} from "../db/clientPrisma";
import { convertToType } from "../utils/convertToType";


export const createGenre = async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
        // Verificar si el género ya existe
        const existingGenre = await prismaClient.genres.findFirst({ where: { name } });

        if (existingGenre) {
            return res.status(400).send({ error: 'Genre already exists' });
        }

        // Crear el nuevo género
        const newGenre = await prismaClient.genres.create({ data: { name } });

        res.status(201).send({ status: 'success', message: 'Genre created successfully', newGenre });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};


export const getMoviesByGenreAndUser = async (req: Request, res: Response) => {
    const { genreName, userId } = req.params;
    const pageSize = 4; // Number of movies per page
    const currentPage = req.query.page ? parseInt(req.query.page.toString()) : 1; // Current page
    try {
        const skip = (currentPage - 1) * pageSize;

        const genre = await prismaClient.genres.findFirst({
            where: { name: genreName },
            include: {
                movies: {
                    where: { userId: convertToType(userId) },
                    skip: skip,
                    take: pageSize,
                    include: {
                        genre: {
                            select: {
                                name: true
                            }
                        },
                        image: {
                            select: {
                                secure_url: true,
                                public_id: true
                            }
                        }
                    }
                }
            }
        });

        if (!genre) {
            return res.status(404).send({ status: 'error', error: "Genre not found" });
        }

        const totalMovies = await prismaClient.movies.count({ where: { genreId: convertToType(genre.id), userId:convertToType(userId) } });
        const totalPages = Math.ceil(totalMovies / pageSize);

        res.status(200).send({
            status: 'success',
            movies: genre.movies,
            pagination: {
                currentPage,
                pageSize,
                totalMovies,
                totalPages
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: 'error', error: 'An error occurred' });
    }
};






export const getAllGenres = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {

        const allGenres = await prismaClient.genres.findMany({
            include: {
                movies: {
                    where: {userId: convertToType(userId)},
                    select: {
                        id: true,
                        title: true,
                        year: true,
                        language: true,
                        description: true,
                        image: true,
                    }
                }
            }
        })


        res.status(201).send(allGenres)

    } catch (error) {
        res.status(500).send(error)
    }
}