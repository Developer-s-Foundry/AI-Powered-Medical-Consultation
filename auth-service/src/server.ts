import dotenv from 'dotenv';
import express from 'express';
import AppDataSource from './config/database';
import { Logger } from './config/logger';

const logger = Logger.getInstance();

(async () => {
    dotenv.config();

    const port = process.env.PORT;
    const app: express.Application = express();
    app.use(express.json());
    
    try {
       await AppDataSource.initialize();
       console.log('Database connection established successfully.');
       app.listen(port, () => {
            logger.logToConsole();
            logger.info(`Server is running on port ${port}`);
       });  
    } catch (error) {
        logger.error('Error starting server:', error);
    }
})();
