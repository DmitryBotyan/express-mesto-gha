const Card = require('../models/card');
const { ValidationError, CastError, DocumentNotFoundError } = require('../middlewares/error');

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.user._id,
  })
    .then((newCard) => {
      res.statusCode(201).send(newCard);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      next(new DocumentNotFoundError('Объект не найден'));
    })
    .then((card) => {
      if (card.owner.toJSON() === req.user._id) {
        res.send(card);
      }
    }).catch((err) => {
      if (err instanceof CastError) {
        next(new CastError('Невалидный идентификатор'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      next(new DocumentNotFoundError('Объект не найден'));
    })
    .then((like) => {
      res.send(like);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new CastError('Невалидный идентификатор'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      next(new DocumentNotFoundError('Объект не найден'));
    })
    .then((disLike) => {
      res.send(disLike);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new CastError('Невалидный идентификатор'));
      } else {
        next(err);
      }
    });
};
