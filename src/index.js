import app from './app.js';
import { config } from 'dotenv';
config();
import connectToMongoDB from './database/mongoDB.js'


const PORT = process.env.PORT || 3000;


// connect to MongoDB and Start the server 
connectToMongoDB().then(() => {
    app.listen(PORT, (err) => {
        if (err) console.log(err);
        console.log(`Server listening on port ${PORT}`);
    });
}).catch((error) => {
    console.log(error);
})
