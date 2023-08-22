import dotenv from "dotenv";

// Definición de tipos para la configuración
type TConfig = {
    [key: string]: EnvironmentConfig;
}

type EnvironmentConfig = {
    app: appConfig;
    auth0: auth0Config;
}

type appConfig = {
    PORT: string | number; // Puerto en el que se ejecutará la aplicación
}
type auth0Config = {
    client_origin: string | undefined;
    audience:  string | undefined;
    issuer:  string | undefined;
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
        auth0: {
            client_origin: process.env.APP_ORIGIN,
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER
        }

    },
    production: {
        app: {
            PORT: process.env.PORT || 4002 // Puerto para producción
        },
        auth0: {
            client_origin: process.env.APP_ORIGIN,
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER
        }

    }
}

// Exportar la configuración correspondiente al modo actual (development o production)
export default CONFIG[ENV];
