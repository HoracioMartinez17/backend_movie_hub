import { Request, Response } from 'express';
import UserModel from '../models/user.model'; // Importar el modelo de usuario

// Controlador para crear un nuevo usuario
export const createUsers = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Verificar si se proporcionaron todos los campos requeridos
        if (!name || !email || !password) {
            return res.status(400).send({ error: "Please provide all the required fields" });
        }
        // Crear un nuevo usuario en la base de datos
        const newUser = await UserModel.create({ name, email, password });
        res.status(201).send({ msg: "User created", user: newUser });
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};

// Controlador para obtener un usuario por su ID
export const getUserById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        // Buscar el usuario por su ID y popula su campo "movies" con los documentos de películas
        const user = await UserModel.findById(userId).populate('movies');

        if (!user) {
            // Si no se encuentra el usuario, devolver un mensaje de error
            return res.status(404).send({ error: "User not found" });
        }

        // Si se encontró el usuario, devolverlo en la respuesta
        res.status(200).send(user);
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};


// Controlador para obtener todos los usuarios
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const allUsers = await UserModel.find()
        res.status(201).send(allUsers);
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};

// Controlador para actualizar los datos de un usuario
export const updateUsers = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email } = req.body;

    try {
        // Actualizar el usuario por su ID y devolver el usuario actualizado
        const user = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { $set: { name: name, email: email } },
            { new: true }
        );
        res.status(201).send(user);
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};


// Controlador para eliminar un usuario
export const deleteUsers = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        // Buscar y eliminar el usuario por su ID
        await UserModel.findByIdAndDelete({ _id: userId });

        console.log('delete user'); // Imprimir un mensaje en la consola

        res.status(204).send(); // Devolver una respuesta exitosa sin contenido
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error'});
    }
};

