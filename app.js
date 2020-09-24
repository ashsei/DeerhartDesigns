// DEPENDENCIES // 
const express = require('express');
const app = express();
require('dotenv').config();


// ROUTES //
app.get('/', (req, res) => {
    res.send('Hello from Node')
})



// LISTENER //
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})