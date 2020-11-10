// DEPENDENCIES & SETUP //
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressValidator = require('express-validator');

    // Import Routes
    const authRoutes = require('./routes/auth.js');
    const userRoutes = require('./routes/user.js');
    const categoryRoutes = require('./routes/category.js');
    const productRoutes = require('./routes/product.js');
    const braintreeRoutes = require('./routes/braintree.js');
    const orderRoutes = require('./routes/order.js');

// MONGODB CONNECTION //
mongoose.connect(
    process.env.MONGO_URI, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
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
app.use(cors());

// ROUTES MIDDLEWARE //
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);

// LISTENER //
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});