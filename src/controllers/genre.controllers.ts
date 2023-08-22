import {Request, Response} from "express";
import prisma from "../db/clientPrisma";


export const createGenre = async (req: Request, res: Response) => {
    const {name} = req.body


    try {

        if (!name) {
            return res.status(400).send({
                message: "Please provide a name"
            })
         }
    
        const newGenre = await prisma.genres.create({data:name});

        res.status(201).send(newGenre)

    } catch (error) {
        res.status(500).send(error)
    }
}

export const getMoviesByGenreAndUser = async (req: Request, res: Response) => {
    const { genreName, userId } = req.params;
    
    try {
        const genre = await prisma.genres.findFirst({
            where: { name: genreName },
            include: {
                Movies: {
                    where: { userId }, // Filtrar películas por el usuario
                    select: {
                        id: true,
                        title: true,
                        year: true,
                        language: true,
                        description: true,
                        image: true,
                    },
                },
            },
        });

        if (!genre) {
            return res.status(404).send({ status: 'error', error: "Genre not found" });
        }

        res.status(200).send({ status: 'success', movies: genre.Movies });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal server error' });
    }
};




export const getAllGenres = async (req: Request, res: Response) => {

    try {

        const allGenres = await prisma.genres.findMany()


        res.status(201).send(allGenres)

    } catch (error) {
        res.status(500).send(error)
    }
}