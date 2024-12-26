import app from './app.js';
import { config } from 'dotenv';
config();


const PORT = process.env.PORT || 3000;


// Start Server 
app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`Server listening on port ${PORT}`);
});
