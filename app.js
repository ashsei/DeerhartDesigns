// DEPENDENCIES & SETUP // 
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
require('dotenv').config();
    // Import Routes
    const userRoutes = require('./routes/user.js');


// MONGODB CONNECTION //
mongoose.connect(
    process.env.MONGO_URI, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        useCreateIndex: true,
    }
)
.then(() => console.log('Connected to MongoDB!'));

mongoose.connection.on('error', err => {
    console.log(`DB Connection Error: ${err.message}`);
});

// MIDDLEWARE //
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// ROUTES MIDDLEWARE //
app.use("/api", userRoutes);


// LISTENER //
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});