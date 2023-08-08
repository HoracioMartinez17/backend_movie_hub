import { model, Schema, Document } from "mongoose";
import { mongoosePagination, Pagination } from "mongoose-paginate-ts";
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
        trim: true //  el trim es para eliminar espacios en blanco adicionales
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true //  el trim es para eliminar espacios en blanco adicionales
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



// Middleware que se ejecuta antes de guardar un usuario en la base de datos
UserSchema.pre<IUser>('save', async function (next) {
    try {
        
        const user = this;

        // Si la contraseña no ha sido modificada, pasa al siguiente middleware
        if (!user.isModified('password')) return next();

        // Genera un salt (valor aleatorio) para el hash de la contraseña
        const salt = await bcrypt.genSalt(10);

        // Genera el hash de la contraseña utilizando el salt
        const hash = await bcrypt.hash(user.password, salt);

        // Reemplaza la contraseña con el hash
        user.password = hash;

        // Continúa con el siguiente middleware
        next();
    } catch (error: any) {
        // Manejo de errores: llama al siguiente middleware con el error
        return next(error);
    }
});

// Método personalizado para comparar contraseñas
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    try {
        const user = this;

        // Compara la contraseña proporcionada con la contraseña almacenada en el documento
        const isMatch = await bcrypt.compare(candidatePassword, user.password);

        // Devuelve el resultado de la comparación
        return isMatch;
    } catch (error: any) {
        // Si hay un error, lanza una excepción
        throw error;
    }
}

// Crea el modelo 'User' utilizando el esquema definido
UserSchema.plugin(mongoosePagination);
const UserModel: Pagination<IUser> = model<IUser, Pagination<IUser>>("User", UserSchema);

export default UserModel
