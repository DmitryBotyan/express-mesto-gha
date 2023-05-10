const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {
  createUser, getUser, getAllUsers, updateUser, updateAvatar, login,
} = require('../controllers/users');
const {
  createUserValidation, loginValidation, updateUserValidation, updateAvatarValidation,
} = require('../validation/validation');

usersRouter.get('/', auth, getAllUsers);
usersRouter.get('/me', auth, getUser);
usersRouter.post('/signin', loginValidation, login);
usersRouter.post('/signup', createUserValidation, createUser);
usersRouter.patch('/me', auth, updateUserValidation, updateUser);
usersRouter.patch('/me/avatar', auth, updateAvatarValidation, updateAvatar);

module.exports = usersRouter;
