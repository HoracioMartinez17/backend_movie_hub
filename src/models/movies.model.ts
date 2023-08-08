import { model, Schema, Document } from "mongoose";

export interface IMoviesDocument extends Document {
    name: string,
    year: number,
    genres: string[],
    description: string,
    language: string,
    image: string
}

const MoviesSchema = new Schema <IMoviesDocument>({
    name: {
        type: String,
        required: true,
        trim: true //  el trim es para eliminar espacios en blanco adicionales
    },
    year: {
        type: Number,
        required: true,
        trim: true //  el trim es para eliminar espacios en blanco adicionales
    },
   genres: [{ type: String, trim: true }],
    language: {
        type: String,
        required: true,
        trim: true //  el trim es para eliminar espacios en blanco adicionales
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
   

}, { timestamps: true, versionKey: false });

// Crea el modelo 'Movie' utilizando el esquema definido
const MoviesModel =  model<IMoviesDocument>('Movies', MoviesSchema);

export default MoviesModel;