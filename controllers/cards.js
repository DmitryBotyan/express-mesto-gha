const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const {
    name, link, likes, createdAt,
  } = req.body;
  const { id } = req.user;

  Card.create({
    name, link, owner: id, likes, createdAt,
  })
    .then((newCard) => {
      res.send(newCard);
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

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
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
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные.',
        });
      } else if (err.name === 'CastError') {
        res.status(404).send({
          message: 'Карточка с указанным _id не найдена.',
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
    .then((like) => {
      res.send(like);
    });
};
