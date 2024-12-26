import rateLimit from "express-rate-limit";
import hpp from "hpp";
import helmet from "helmet";


// Global Rate Limiter
const rateLimitOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after an hour",
    standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // disable the `X-RateLimit-*` headers
};
export const rateLimiterMiddleware = rateLimit(rateLimitOptions); // Apply rate limiter only to API requests



// Set security headers in HTTP responses
const helmetOptions = {}
export const helmetMiddleware = helmet(helmetOptions);



// Prevent HTTP parameter pollution
const hppOptions = {}
export const hppmiddleware = hpp(hppOptions);