import app from "./server";
import config from './config/config';


const PORT = config.app.PORT;
console.log(PORT)
app.listen(PORT, (): void => {
    console.log(`Server listening on port ${PORT}`);
});