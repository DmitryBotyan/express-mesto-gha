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
  const { id } = req.params;
  Card.findById(id)
    .then((card) => {
      if (card.owner.toJSON() === req.user._id) {
        Card.deleteOne(card)
          .orFail(() => {
            next(new DocumentNotFoundError('Объект не найден'));
          })
          .then((c) => {
            res.send(c);
          }).catch((err) => {
            if (err instanceof CastError) {
              next(new CastError('Невалидный идентификатор'));
            } else {
              next(err);
            }
          });
      } else {
        res.send({
          message: 'Нельзя удалить чужую карточку',
        });
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
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
  const { id } = req.params;

  Card.findByIdAndUpdate(
    id,
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
