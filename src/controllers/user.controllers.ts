import { Request, Response } from 'express';
import UserModel from '../models/user.model'; // Importar el modelo de usuario

// Controlador para crear un nuevo usuario
export const createUsers = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
        // Verificar si se proporcionaron todos los campos requeridos
        const UniqueEmail = await UserModel.exists({ email })
        if (!name || !email || !password) {
            return res.status(400).send({ status: 'error', error: "Please provide all the required fields" });
        }
        //Verificar si el email ya existe en la base de datos
        if (UniqueEmail) {
            return res.status(400).send({ status: 'error', error: "User with this email already exists." });
        }
        // Verificar si el password es correcto
        if (password.length < 6) {
            return res.status(400).send({ status: 'error', error: "Password must be at least 6 characters long." });
        }
        // Verificar si el email es válido
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).send({ status: 'error', error: "Invalid email format. Make sure it includes: '@', '.'" });
        }
        // Verificar que el nombre de usuario sea correcto
        if (name.length > 30 || name.length < 2) {
            return res.status(400).send({ status: 'error', error: "Invalid username. It must be between 2 and 30 characters long." })
        }
        // Crear un nuevo usuario en la base de datos
        const newUser = await UserModel.create({ name, email, password });
        res.status(201).send({ status: 'success', message: "User created successfully!", user: newUser });
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ status: 'error', error: 'Internal server error' });
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
            return res.status(404).send({ status: 'error', error: "User not found" });
        }

        // Si se encontró el usuario, devolverlo en la respuesta
        res.status(200).send({ status: 'success' ,user});
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};


    // Controlador para obtener todos los usuarios
    export const getAllUsers = async (req: Request, res: Response) => {
    try {
        // Obtener todos los usuarios de la base de datos
        const allUsers = await UserModel.find().populate('movies');
        // Verificar si tenemos usuarios en la base de datos
        if (!allUsers) {
            // Si no se encuentran usuarios, devolver un mensaje de error
            return res.status(404).send({ status: 'error', error: "Users not found" });
        }
       // Si se encontró el usuario, devolverlo en la respuesta
        res.status(201).send({ status: 'success', allUsers});
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ status: 'error', error: 'Internal server error' });
    }
};

// Controlador para actualizar los datos de un usuario
export const updateUsers = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { name, email } = req.body;

    try {

        // Verificar si el usuario existe antes de intentar actualizarlo
        const existingUser = await UserModel.findById(userId);
        if (!existingUser) {
             // Si no se encuentran el usuario, devolver un mensaje de error
            return res.status(404).send({ status: 'error', message: 'User not found' });
        }
        // Actualizar el usuario por su ID y devolver el usuario actualizado
        const userUpdate = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { $set: { name: name, email: email } },
            { new: true }
        );
        // verificacio de adicional por si ocurre algun error al actualizar el usuario
        if (!userUpdate) {
            return res.status(400).send({ status: 'error', message: 'error updating user' })
        }
        res.status(201).send({ status: 'success', message: 'User updated successfully', user: userUpdate });
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};


// Controlador para eliminar un usuario
export const deleteUsers = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        // Buscar y eliminar el usuario por su ID
        const userDelete = await UserModel.findByIdAndDelete({ _id: userId });
        // verificar si el usuario existe en la base de datos
         if(!userDelete) {
            return res.status(404).send({ status: 'error', message: 'user not found' })
         }
        console.log('delete user'); // Imprimir un mensaje en la consola

        res.status(204).send({ status: 'success', message: 'User deleted successfully'}); // Devolver una respuesta exitosa
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};

