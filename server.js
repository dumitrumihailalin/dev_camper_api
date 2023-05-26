const express = require('express');
const dotenv = require('dotenv');
const path = require('path');   
const logger = require('./middleware/logger');
const connectDB = require('./config/db');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const auth = require('./routes/auth');

// Load env vars
dotenv.config({ path: './config/config.env'});
connectDB();
const app = express();

app.use(logger);
app.use(express.json());
// File upload
app.use(fileUpload());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// Dev login middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(errorHandler);

app.use(cookieParser());
// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server running ${process.env.NODE_ENV} ${PORT}`));

// handle unhandled promise rejections
    process.on('unhandledRejection', (error, promise) => {
        console.log(`Error ${error.message}`)
        server.close(() => process.exit(1))
    })