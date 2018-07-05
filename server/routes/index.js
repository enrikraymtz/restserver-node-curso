const express = require('express');
const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./categoria'));
app.use(require('./producto'));
app.use(require('./uploads'));
app.use(require('./imagenes'));

app.use(require('./personas_similares'));

module.exports = app;
