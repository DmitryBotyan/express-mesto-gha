const User = require('../models/user');
const bcrypt = require('../node_modules/bcryptjs');
const jwt = require('../node_modules/jsonwebtoken');
const {
  ValidationError, CastError, DocumentNotFoundError, AuthError,
} = require('../middlewares/error');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const { name, about, avatar } = req.body;
    User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }).then((newUser) => {
      res.status(200).send(newUser);
    });
  })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        res.status(409).send({
          message: 'Такой пользователь уже существует',
        });
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: 604800 });
      res.cookie('_id', user._id);
      res.send({ token });
    })
    .catch(() => {
      throw new AuthError('Необходима авторизация');
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.cookies)
    .orFail(() => {
      throw new DocumentNotFoundError('Объект не найден');
    })
    .then((user) => {
      res.send(user);
    }).catch((err) => {
      if (err instanceof CastError) {
        next(new CastError('Невалидный идентификатор'));
      } else {
        next(err);
      }
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true })
    .orFail(() => {
      throw new DocumentNotFoundError('Объект не найден');
    })
    .then((updatedUser) => {
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user.id, req.body, { new: true, runValidators: true })
    .orFail(() => {
      throw new DocumentNotFoundError('Объект не найден');
    })
    .then((updatedAvatar) => {
      res.send(updatedAvatar);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
