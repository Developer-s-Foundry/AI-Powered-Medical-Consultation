import { databaseConfig } from "./env.config";
import { DataSource } from "typeorm";


const AppDataSource =  new DataSource({
    type: "postgres",
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    synchronize: true,
    logging: false,
    entities: ["src/entities/**/*.ts"],
    migrations: ["src/migrations/**/*.ts"],
});

export default AppDataSource;