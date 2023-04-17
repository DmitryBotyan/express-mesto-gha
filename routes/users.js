const usersRouter = require('express').Router();
const {
  createUser, getUser, getAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getUser);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports = usersRouter;
