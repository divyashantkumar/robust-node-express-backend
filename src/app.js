//express-async-error lets the application throw error instead forcing to use next() function in async functions
import 'express-async-errors';
import boolParser from 'express-query-boolean';

import { config } from 'dotenv';
config();
import express from "express";
import path from "path";
import cors from 'cors'
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./utils/loggers.js";
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import { globalErrorHandler } from './middlewares/globalErrorHandler.js';
import { 
    morganOptions, 
    rateLimitOptions, 
    helmetOptions, 
    hppOptions, 
    corsOptions, 
} from './utils/middlewareOptions.js';
import sampleRouter from './routes/sample.js'


const app = express();

// Custom Morgan Format for logging requests and responses in the console 
const morganFormat = ":method :url :status :response-time ms";

// 1. Logging Middleware
if(process.env.NODE_ENV === "development") app.use(morgan(morganFormat, morganOptions));


// 2. Application Security Middleware
app.use('/api', rateLimit(rateLimitOptions)); // Apply rate limiter only to API requests
app.use(helmet(helmetOptions)); // Set security headers in HTTP responses
app.use(hpp(hppOptions)); // Prevent HTTP parameter pollution


// 3. CORS configuration
app.use(cors(corsOptions));


// 4. Body Parser Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(boolParser()); // Parse boolean values in query parameters
// Cookie Parser
app.use(cookieParser());


// 5. Static Files Middleware
app.set('view engine', 'ejs');      // Set up view Engine or Template Engine
app.set('views', path.join(process.cwd(), 'src', 'views'))         // Set up views folder or template folder
app.use(express.static('public'));  // Set up static folder for serving static files like css, images, js, etc.


// 6. Routes
app.use('/api/v1', sampleRouter);

// 7. Home Page Handler
app.use(RegExp('/$'), (req, res, next) => {
    try {
        logger.info('Hello Home Page');
        res.status(200).render('home');
    } catch (error) {
        throw error;
    }
});


// 8. Global Error Handlers    
app.use(globalErrorHandler);


// 9. 404 Global Path Handler
app.use((req, res, next) => {
    res.status(404);
    res.render('error404');
});


export default app;