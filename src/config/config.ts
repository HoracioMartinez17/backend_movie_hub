import dotenv from "dotenv";

// Type definitions for configuration
type TConfig = {
    [key: string]: EnvironmentConfig;
}

type EnvironmentConfig = {
    app: appConfig;
    db: MongoDBConfig;
    auth0: auth0Config;
}

type appConfig = {
    PORT: string | number; // Port on which the application will run
}

type MongoDBConfig = {
    URI: string; // Connection URL for the MongoDB database
}

type auth0Config = {
    client_origin: string | undefined;
    audience:  string | undefined;
    issuer:  string | undefined;
}

// Load environment variables based on the mode (development or production)
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config({ path: '.env.development' });
}

// Get the current execution mode (default is development)
const ENV = process.env.NODE_ENV ?? 'development';

// Configuration for different environments (development and production)
const CONFIG: TConfig = {
    development: {
        app: {
            PORT: process.env.PORT || 4001 // Port for development
        },
        db: {
            URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/test_development' // Database URL for development
        },
        auth0: {
            client_origin: process.env.APP_ORIGIN,
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER
        }
    },
    production: {
        app: {
            PORT: process.env.PORT || 4002 // Port for production
        },
        db: {
            URI: process.env.MONGO_DB_URI || 'mongodb://localhost:27017/test_development' // Database URL for production
        },
        auth0: {
            client_origin: process.env.APP_ORIGIN,
            audience: process.env.AUTH0_AUDIENCE,
            issuer: process.env.AUTH0_ISSUER
        }
    }
}

// Export the configuration corresponding to the current mode (development or production)
export default CONFIG[ENV];
