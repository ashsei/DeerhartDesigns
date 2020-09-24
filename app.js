// DEPENDENCIES & SETUP // 
const express = require('express')
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.js')
require('dotenv').config();

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

// ROUTES MIDDLEWARE //
app.use("/api", userRoutes);


// LISTENER //
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});