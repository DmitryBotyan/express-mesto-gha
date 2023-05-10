const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');
const { errors } = require('./node_modules/celebrate');
const { DocumentNotFoundError } = require('./middlewares/error');
const cookieparser = require('./node_modules/cookie-parser');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1/mestodb');

app.use(express.json());

app.use(cookieparser());

app.use(bodyparser.urlencoded({ extended: true }));

app.use(router);

app.use(errors());

app.use((err, req, res, next) => {
  next(new DocumentNotFoundError('Страница не найдена'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode
      ? 'Что-то пошло не так...'
      : message,
  });
  next();
});

app.listen(3000, () => {});
