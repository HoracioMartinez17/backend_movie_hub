import { Request, Response } from 'express';
import prisma from '../db/clientPrisma' // Importar el modelo de usuario


// Controlador para crear un nuevo usuario
   export const createUsers = async (req: Request, res: Response) => {
    const { name, email} = req.body;

    try {
        // Verificar si se proporcionaron todos los campos requeridos
        if (!name || !email ) {
            return res.status(400).send({ status: 'error', error: 'Name,  and email are required fields.' });
        }
        // Verificar que el nombre de usuario sea correcto
        if (name.length > 30 || name.length < 2) {
            return res.status(400).send({ status: 'error', error: "Invalid username. It must be between 2 and 30 characters long." })
        }

       // Verificar si el email es válido
           const emailFormatIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailFormatIsValid) {
        return res.status(400).send({ status: 'error', error: "Invalid email format. Make sure it includes: '@', '.'" });
            }

        // Verificar si el email ya existe en la base de datos
        const emailExist = await prisma.user.findUnique({ where: { email: email },include: {
            movies: {
                select: {
                    id: true,
                    title: true,
                    year: true,
                    language: true,
                    description: true,
                    image: true,
                    genre: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },});
        if (!emailExist) {
            // Si pasamos todas las validaciones anteriores, se crea un nuevo usuario en la base de datos
            const newUser = await prisma.user.create({ data:{name: name, email:email},include: {
                movies: {
                    select: {
                        id: true,
                        title: true,
                        year: true,
                        language: true,
                        description: true,
                        image: true,
                        genre: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },});
           res.status(201).send({ status: 'success', message: "User created successfully!", user:newUser });
        }else {
            // Si el email ya existe, devuelve los datos del usuario existente
            return res.status(200).send({ status: 'success', message: 'User already exists.', user: emailExist });
          }



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
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                movies: {
                    select: {
                        id: true,
                        title: true,
                        year: true,
                        language: true,
                        description: true,
                        image: true,
                        genre: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
        });

        if (!user) {
            // Si no se encuentra el usuario, devolver un mensaje de error
            return res.status(404).send({ status: 'error', error: "User not found" });
        }

        // Si se encontró el usuario, devolverlo en la respuesta
        res.status(200).send({ status: 'success', user });
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
        const allUsers = await prisma.user.findMany({include:{movies:{include:{genre:true}}}});
        // Verificar si tenemos usuarios en la base de datos
        if (allUsers.length === 0) {
            // Si no se encuentran usuarios, devolver un mensaje de error
            return res.status(404).send({ status: 'error', error: "Users not found" });
        }
       // Si se encontró el usuario, devolverlo en la respuesta
        res.status(200).send({ status: 'success',  allUsers});
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

         // Actualizar el usuario por su ID y devolver el usuario actualizado
        const userUpdate = await prisma.user.update({
            where: { id: userId },
            data: { name, email }
        });

        // Verificar si el usuario existe antes de intentar actualizarlo
        if (!userUpdate) {
             // Si no se encuentran el usuario, devolver un mensaje de error
            return res.status(404).send({ status: 'error', message: 'User not found' });
        }

        // En caso de que todo salga bien, devolver un mensaje de éxito con el usuario actualizado
        res.status(200).send({ status: 'success', message: 'User updated successfully', user: userUpdate });
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
        /// Buscar y eliminar las películas asociadas al usuario
    await prisma.movies.deleteMany({ where: { userId } });

    // Eliminar el usuario por su ID
    const userDelete = await prisma.user.delete({ where: { id: userId }});
        // verificar si ocurrio algun error al eliminar el usuario
         if(!userDelete) {
            // No se encontró el usuario para eliminar, pero la eliminación se considera exitosa
            return res.status(404).send({ status: 'error', message: 'user not found' })
         }

           // Enviar una respuesta exitosa sin contenido
        res.status(204).send({ status: 'success', message: 'User deleted successfully'}); // Devolver una respuesta exitosa
    } catch (err) {
        console.error(err); // Registrar el error en la consola para fines de depuración
        // En caso de error interno, devolver un mensaje de error con código 500
        res.status(500).send({ error: 'Internal server error' });
    }
};

