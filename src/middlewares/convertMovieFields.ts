/**
 * Middleware para convertir y validar campos de una película en el cuerpo de la solicitud.
 * - Convierte valores no-cadena en cadenas.
 * - Convierte el título a minúsculas.
 * - Convierte el name del genero a minúsculas.
 * - En lugar de lanzar un error, una mejor práctica es intentar convertir los datos al formato correcto cuando sea posible,
 * - en lugar de rechazar la solicitud por completo.
 * - Este enfoque intenta convertir los datos en el formato correcto siempre que sea posible,
 * - lo que permite una experiencia más flexible para los usuarios y evita rechazar solicitudes innecesariamente.
*/
import { Request, Response, NextFunction } from 'express';


export const convertMovieFields = (req: Request, res: Response, next: NextFunction) => {
    const { title, year, description, language, image, genres } = req.body;

    // Validar que se proporcionaron todos los campos requeridos
    if (!title || !year || !genres || !language || !image || !description) {
        return res.status(400).send({ error: 'Please provide all required fields' });
    }

    // Validar que el año sea un número
    if (typeof year == 'string') {
        return res.status(400).send({ status: 'error', error: 'Year must be a number' });
    }

    //validar que el language sea un string
    if (typeof language !== 'string') {
        return res.status(400).send({ status: 'error', error: 'Language must be a string' });
    }

    // Convertir el título a string si es un número
    if (typeof title === 'number') {
        req.body.title = title.toString();
    }

    // Convertir el título a minúsculas si es un string
    if (typeof title === 'string') {
        req.body.title = title.toLowerCase();
    }

    // Convertir los géneros a minúsculas si es un array de strings
    if (Array.isArray(genres)) {
        req.body.genres = genres.map(genre => {
            if (typeof genre === 'string') {
                return genre.toLowerCase();
            } else {
                return genre;
            }
        });
    }

    // Convertir la descripción a string si es un número
    if (typeof description === 'number') {
        req.body.description = description.toString();
    }

    // Pasar el control al siguiente middleware
    next();
};