const User = require('../models/user');
const bcrypt = require('../node_modules/bcryptjs');
const jwt = require('../node_modules/jsonwebtoken');
const {
  ValidationError, DocumentNotFoundError, CreateUserError, CastError,
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
    }).then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    });
  })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new ValidationError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new CreateUserError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      next(new DocumentNotFoundError('Объект не найден'));
    })
    .then((user) => {
      res.send(user);
    }).catch((err) => {
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      next(new DocumentNotFoundError('Объект не найден'));
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
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(() => {
      next(new DocumentNotFoundError('Объект не найден'));
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
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .orFail(() => {
      next(new DocumentNotFoundError('Объект не найден'));
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
