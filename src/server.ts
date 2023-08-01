import express, { Express } from 'express';
import UserRoutes from './routes/user.routes';


const app: Express = express();
app.use(express.json())

app.use("/users", UserRoutes);

export default app;