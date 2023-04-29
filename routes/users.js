const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');

const {
  createUser, getUser, getAllUsers, updateUser, updateAvatar, login,
} = require('../controllers/users');

usersRouter.get('/', auth, getAllUsers);
usersRouter.get('/me', auth, getUser);
usersRouter.post('/signin', login);
usersRouter.post('/signup', createUser);
usersRouter.patch('/me', auth, updateUser);
usersRouter.patch('/me/avatar', auth, updateAvatar);

module.exports = usersRouter;
