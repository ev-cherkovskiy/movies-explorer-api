const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateURL, validateTitleRU, validateTitleEN } = require('../utils/utils');

// Импорт контроллеров
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// Роут для получения массива фильмов
router.get('/', getMovies);

// Роут для добавления фильма
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(validateURL),
      trailerLink: Joi.string().required().custom(validateURL),
      thumbnail: Joi.string().required().custom(validateURL),
      movieId: Joi.string().required(),
      nameRU: Joi.string().required().custom(validateTitleRU),
      nameEN: Joi.string().required().custom(validateTitleEN),
    }),
  }),
  createMovie,
);

// Роут для удаления фильма
router.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().required(),
    }),
  }),
  deleteMovie,
);

// Экспорт роутинга
module.exports = router;
