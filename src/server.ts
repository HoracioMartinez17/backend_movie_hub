import express, { Express } from 'express';
import UserRouter from './routes/user.routes';
import MoviesRouter from './routes/movies.routes';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkJwtMiddleware } from './middlewares/checkjwt.middleware';
import errorHandler from './middlewares/error.middleware';


// Inicializar la aplicación Express
const app: Express = express();

// Configurar middlewares
app.use(express.json()); // Middleware para manejar JSON en las solicitudes
app.use(morgan('dev')); // Middleware para el registro de solicitudes en la consola
app.use(cors()); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
dotenv.config(); // Cargar variables de entorno desde el archivo .env
app.use(express.urlencoded({ extended: false })); // Middleware para analizar datos de formularios
app.use(errorHandler);

// Configurar rutas
app.use('/users', checkJwtMiddleware, UserRouter); // Usar el enrutador de usuarios en la ruta /users
app.use('/movies',checkJwtMiddleware, MoviesRouter); // Usar el enrutador de películas en la ruta /movies

export default app;
