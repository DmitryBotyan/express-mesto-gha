const { Joi, celebrate } = require('../node_modules/celebrate');

const urlRegex = /[-a-zA-A0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-A0-9@:%_+.~#?&//=]*)?/i;

const createUserValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
});

const loginValidation = celebrate({
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(30),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object({
    avatar: Joi.string().required().regex(urlRegex),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegex),
  }),
});

const idValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
});

module.exports = {
  createUserValidation,
  loginValidation,
  updateUserValidation,
  updateAvatarValidation,
  createCardValidation,
  idValidation,
};
