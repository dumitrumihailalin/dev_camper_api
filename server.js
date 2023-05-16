const express = require('express');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const connectDB = require('./config/db');
const morgan = require('morgan');
// Route files
const bootcamps = require('./routes/bootcamps');

// Load env vars
dotenv.config({ path: './config/config.env'});
connectDB();
const app = express();

app.use(logger);
app.use(express.json());
// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
// Dev login middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running ${process.env.NODE_ENV} ${PORT}`));

// handle unhandled promise rejections
    process.on('unhandledRejection', (error, promise) => {
        console.log(`Error ${error.message}`)
        server.close(() => process.exit(1))
    })