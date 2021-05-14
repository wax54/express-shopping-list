const express = require('express');
const { pageNotFound, expressErrorHandler } = require('./ExpressError');
const itemRoutes = require('./itemRoutes');
const app = express();

app.use(express.json());
app.use('/items', itemRoutes);

app.use(pageNotFound);
app.use(expressErrorHandler);

module.exports = app;