const express = require('express');
const recipeRoutes = require('./routes/recipes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json({ limit: '100kb' }));
app.use('/api/recipes', recipeRoutes);
app.use((req, res) => res.status(404).json({ error: 'Endpoint not found.' }));
app.use(errorHandler);

module.exports = app;