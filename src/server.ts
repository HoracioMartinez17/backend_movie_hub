import express, { Express } from 'express';
import UserRouter from './routes/user.routes';
import MoviesRouter from './routes/movies.routes';
import morgan from 'morgan';
import cors from 'cors';
import GenreRouter from './routes/genre.routes';
import errorHandler from './middlewares/error.middleware';
import fileUpload from 'express-fileupload';

// Inicializar la aplicación Express
const app: Express = express();

// Configurar middlewares
app.use(express.json()); // Middleware para manejar JSON en las solicitudes
app.use(morgan('dev')); // Middleware para el registro de solicitudes en la consola
app.use(cors()); // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
app.use(express.urlencoded({ extended: false })); // Middleware para analizar datos de formularios
// Configurar express-fileupload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads"
}));
app.use(errorHandler); // Middleware para manejar errores



// Configurar rutas
app.use('/user', UserRouter); // Usar el enrutador de usuarios en la ruta /users
app.use('/movies', MoviesRouter); // Usar el enrutador de películas en la ruta /movies
app.use("/genres" ,GenreRouter); // Usar el enrutador de películas en la ruta /genres
app.use(errorHandler)

export default app;
