import dotenv from "dotenv";

// Definición de tipos para la configuración
type TConfig = {
    [key: string]: EnvironmentConfig;
}

type EnvironmentConfig = {
    app: appConfig;
}

type appConfig = {
    PORT: string | number; // Puerto en el que se ejecutará la aplicación
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

    },
    production: {
        app: {
            PORT: process.env.PORT || 4002 // Puerto para producción
        }

    }
}

// Exportar la configuración correspondiente al modo actual (development o production)
export default CONFIG[ENV];
