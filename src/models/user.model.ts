import { model, Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    movies?: string[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema <IUser>({
    name: {
        type: String,
        required: true,
        minlength: 2,
        trim: true // Trim is used to remove extra whitespace
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true // Trim is used to remove extra whitespace
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    movies: {
        type: [{type: Schema.Types.ObjectId, ref: 'Movies'}]
    }

}, { timestamps: true, versionKey: false });

// Middleware that runs before saving a user to the database
UserSchema.pre<IUser>('save', async function (next) {
    try {
        
        const user = this;

        // If the password has not been modified, move on to the next middleware
        if (!user.isModified('password')) return next();

        // Generate a salt (random value) for password hashing
        const salt = await bcrypt.genSalt(10);

        // Generate the password hash using the salt
        const hash = await bcrypt.hash(user.password, salt);

        // Replace the password with the hash
        user.password = hash;

        // Continue with the next middleware
        next();
    } catch (error: any) {
        // Error handling: call the next middleware with the error
        return next(error);
    }
});

// Custom method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    try {
        const user = this;

        // Compare the provided password with the password stored in the document
        const isMatch = await bcrypt.compare(candidatePassword, user.password);

        // Return the result of the comparison
        return isMatch;
    } catch (error: any) {
        // If there is an error, throw an exception
        throw error;
    }
}

// Create the 'User' model using the defined schema
const UserModel =  model<IUser>('User', UserSchema);

export default UserModel;
