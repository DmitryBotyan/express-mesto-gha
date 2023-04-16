const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(500).send({
          message: 'Что-то пошло не так...',
        });
      }
    });
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(500).send({
          message: 'Что-то пошло не так...',
        });
      }
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      } else {
        res.status(500).send({
          message: 'Что-то пошло не так...',
        });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { userId } = req.params;
  User.findByIdAndUpdate(userId, req.body)
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(500).send({
          message: 'Что-то пошло не так...',
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { userId } = req.params;
  User.findByIdAndUpdate(userId, req.body)
    .then((updatedAvatar) => {
      res.send(updatedAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные',
        });
      } else if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Пользователь по указанному _id не найден',
        });
      } else {
        res.status(500).send({
          message: 'Что-то пошло не так...',
        });
      }
    });
};
