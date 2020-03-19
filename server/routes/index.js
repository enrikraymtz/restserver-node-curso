const express = require('express');
const app = express();

app.use(require('./alumno'));

module.exports = app;
