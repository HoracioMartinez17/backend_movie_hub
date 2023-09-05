import { model, Schema, Document } from "mongoose";

export interface IMoviesDocument extends Document {
    name: string,
    year: number,
    genre: string,
    description: string,
    language: string,
    image: string
}

const MoviesSchema = new Schema <IMoviesDocument>({
    name: {
        type: String,
        required: true,
        trim: true //  the trim is to remove extra whitespace
    },
    year: {
        type: Number,
        required: true,
        trim: true //  the trim is to remove extra whitespace
    },
    genre: {
        type: String,
        required: true,
        trim: true //  the trim is to remove extra whitespace
    },
    language: {
        type: String,
        required: true,
        trim: true //  the trim is to remove extra whitespace
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

// Create the 'Movie' model using the defined schema
const MoviesModel =  model<IMoviesDocument>('Movies', MoviesSchema);

export default MoviesModel;