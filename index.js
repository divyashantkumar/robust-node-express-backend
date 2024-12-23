//express-async-error lets the application throw error instead forcing to use next() function in async functions
import 'express-async-errors';
import boolParser from 'express-query-boolean';

import path from "path";
import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import morgan from "morgan";
import logger from "./util/loggers.js";
import sampleRouter from './route/sample.js'
import {
    rateLimiterMiddleware,
    helmetMiddleware,
    hppmiddleware
} from "./middlewares/security.js";
import globalErrorHandler from './middlewares/globalErrorHandler.js';


// Custom Morgan Format for logging requests and responses in the console 
const morganFormat = ":method :url :status :response-time ms";

const app = express();
const PORT = process.env.PORT || 3000;

// Logging Middleware
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);


// Application Security Middleware
app.use('/api', rateLimiterMiddleware); // Apply rate limiter only to API requests
app.use(helmetMiddleware); // Set security headers in HTTP responses
app.use(hppmiddleware); // Prevent HTTP parameter pollution


// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if the origin is allowed
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

        // //regEx to test for divyashant.in subdomains 
        // const allowedOriginsRegex = /^https?:\/\/([a-z0-9-]+\.)?divyashant\.in(:\d+)?$/;

        console.log('Request origin:', origin);

        if (allowedOrigins.indexOf(origin) === -1 /* && !allowedOriginsRegex.test(origin) */) {
            const error = new Error('Not allowed by CORS');
            error.status = 403;
            return callback(error);
        }
        return callback(null, true);
    },

    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow only these methods
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept",
    ], // Allow only these headers
    exposedHeaders: ['Content-Length'], // Expose these headers to the client
    credentials: true, // Allow cookies and authentication headers to be sent across domains
    maxAge: 3600, // Cache CORS preflight requests for 1 hour
    optionsSuccessStatus: 204,
}
app.use(cors(corsOptions));


// Body Parser Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(boolParser()); // Parse boolean values in query parameters
// Cookie Parser
app.use(cookieParser());


// Static Files Middleware
app.set('view engine', 'ejs');      // Set up view Engine or Template Engine
app.set('views', path.join(process.cwd(), 'views'))         // Set up views folder or template folder
app.use(express.static('public'));  // Set up static folder for serving static files like css, images, js, etc.


// Home Page Handler
app.use(RegExp('/$'), (req, res, next) => {
    try {
        logger.info('Home Page');
        res.status(200).render('home');
    } catch (error) {
        throw error;
    }
});


// Routes
app.use('/api', sampleRouter);


// 404 Global Path Handler
app.use((req, res, next) => {
    res.status(404);
    res.render('error404');
});

// Global Error Handlers    
app.use(globalErrorHandler);


// Start Server 
app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`Server listening on port ${PORT}`);
});
