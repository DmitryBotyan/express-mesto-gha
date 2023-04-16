const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

mongoose
  .connect('mongodb://127.0.0.1/mestodb');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = { id: '6437f04b75f9ccf18e035bfe' };
  next();
});
app.use(router);

app.listen(3000, () => {});
