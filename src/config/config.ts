import dotenv from "dotenv";

// Definición de tipos para la configuración
type TConfig = {
    [key: string]: EnvironmentConfig;
}

type EnvironmentConfig = {
    app: appConfig;
    db: MongoDBConfig;
}

type appConfig = {
    PORT: string | number; // Puerto en el que se ejecutará la aplicación
}

type MongoDBConfig = {
    URI: string; // URL de conexión a la base de datos MongoDB
}

// Cargar variables de entorno según el modo (development o production)
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.development' });
}

// Obtener el modo de ejecución actual (development por defecto)
const ENV = process.env.NODE_ENV ?? 'development';

// Configuración para diferentes entornos (development y production)
const CONFIG: TConfig = {
    development: {
        app: {
            PORT: process.env.PORT || 4001 // Puerto para desarrollo
        },
        db: {
            URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/test_development' // URL de la base de datos para desarrollo
        }
    },
    production: {
        app: {
            PORT: process.env.PORT || 4002 // Puerto para producción
        },
        db: {
            URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/test_development' // URL de la base de datos para producción
        }
    }
}

// Exportar la configuración correspondiente al modo actual (development o production)
export default CONFIG[ENV];
