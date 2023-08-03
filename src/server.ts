import express, { Express } from 'express';
import UserRouter from './routes/user.routes';
import MoviesRouter from './routes/movies.routes';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// Inicializar la aplicación Express
const app: Express = express();

// Configurar middlewares
app.use(express.json()); // Middleware para manejar JSON en las solicitudes
app.use(morgan('dev')); // Middleware para el registro de solicitudes en la consola
app.use(cors()); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
dotenv.config(); // Cargar variables de entorno desde el archivo .env
app.use(express.urlencoded({ extended: false })); // Middleware para analizar datos de formularios

// Configurar rutas
app.use('/users', UserRouter); // Usar el enrutador de usuarios en la ruta /users
app.use('/movies', MoviesRouter); // Usar el enrutador de películas en la ruta /movies

export default app;
