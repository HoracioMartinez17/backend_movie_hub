import express, { Express } from 'express';
import UserRouter from './routes/user.routes';
import MoviesRouter from './routes/movies.routes';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import { checkJwtMiddleware } from './middlewares/checkjwt.middleware';
import errorHandler from './middlewares/error.middleware';

// Initialize the Express application
const app: Express = express();

// Configure middlewares
app.use(express.json()); // Middleware for handling JSON in requests
app.use(morgan('dev')); // Middleware for request logging in the console
app.use(cors()); // Middleware to enable CORS (Cross-Origin Resource Sharing)
dotenv.config(); // Load environment variables from the .env file
app.use(express.urlencoded({ extended: false })); // Middleware for parsing form data
app.use(errorHandler); // Middleware for handling errors

// Configure routes
app.use('/users', checkJwtMiddleware, UserRouter); // Use the user router at the /users route with JWT check
app.use('/movies', checkJwtMiddleware, MoviesRouter); // Use the movies router at the /movies route with JWT check

export default app;
