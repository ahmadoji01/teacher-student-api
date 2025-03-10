const express = require('express');
const createError = require('http-errors');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || '3000';

const apiRouter = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);

app.use((req, res, next) => {
  next(createError(404, 'Not Found'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app;