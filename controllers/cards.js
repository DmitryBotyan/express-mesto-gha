const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const {
    name, link,
  } = req.body;
  const { id } = req.user;

  Card.create({
    name, link, owner: id,
  })
    .then((newCard) => {
      res.status(201).send(newCard);
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

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(() => {
      res.status(500).send({
        message: 'Что-то пошло не так...',
      });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const error = new Error('Карточка по заданному id отсутствует в базе');
      error.statusCode = 404;
      throw error;
    })
    .then((card) => {
      res.send(card);
    }).catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.name === 'CastError') {
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

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: req.user.id },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      const error = new Error('Карточка по заданному id отсутствует в базе');
      error.statusCode = 404;
      throw error;
    })
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Невалидный идентификатор',
        });
      } else {
        res.status(500).send({
          message: 'Что-то пошло не так...',
        });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: req.user.id },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      const error = new Error('Карточка по заданному id отсутствует в базе');
      error.statusCode = 404;
      throw error;
    })
    .then((disLike) => {
      res.send(disLike);
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Невалидный идентификатор',
        });
      } else {
        res.status(500).send({
          message: 'Что-то пошло не так...',
        });
      }
    });
};
