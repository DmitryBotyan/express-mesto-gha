const usersRouter = require('express').Router();
const {
  getCurrentUser, getAllUsers, updateUser, updateAvatar, getUser,
} = require('../controllers/users');
const { updateUserValidation, updateAvatarValidation, idValidation } = require('../validation/validation');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:id', idValidation, getUser);
usersRouter.patch('/me', updateUserValidation, updateUser);
usersRouter.patch('/me/avatar', updateAvatarValidation, updateAvatar);

module.exports = usersRouter;
