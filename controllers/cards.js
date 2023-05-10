const Card = require('../models/card');
const { ValidationError, CastError, DocumentNotFoundError } = require('../middlewares/error');

module.exports.createCard = (req, res, next) => {
  const {
    name, link,
  } = req.body;

  Card.create({
    name, link, owner: req.cookies,
  })
    .then((newCard) => {
      res.status(201).send(newCard);
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
    .populate(['name', 'about', 'avatar', 'email'])
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
      throw new DocumentNotFoundError('Объект не найден');
    })
    .then((card) => {
      res.send(card);
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
      $addToSet: { likes: req.cookies },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      throw new DocumentNotFoundError('Объект не найден');
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
      $pull: { likes: req.cookies },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      throw new DocumentNotFoundError('Объект не найден');
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
