const usersRouter = require('express').Router();
const {
  createUser, getUser, getAllUsers, updateUser, updateAvatar,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createUser);
usersRouter.patch('/:userId', updateUser);
usersRouter.patch('/:userId/avatar', updateAvatar);

module.exports = usersRouter;
