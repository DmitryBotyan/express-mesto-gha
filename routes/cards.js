const cardsRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, idValidation } = require('../validation/validation');

cardsRouter.get('/', getCards);
cardsRouter.post('/', createCardValidation, createCard);
cardsRouter.delete('/:id', idValidation, deleteCard);
cardsRouter.put('/:id/likes', idValidation, likeCard);
cardsRouter.delete('/:id/likes', idValidation, dislikeCard);

module.exports = cardsRouter;
