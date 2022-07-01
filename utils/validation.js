const { Joi, celebrate } = require('celebrate');
const {
  validateURL,
  validateEmail,
  validateTitleRU,
  validateTitleEN,
} = require('./utils');

// Функция для валидации данных при входе в систему
const validateLogin = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Функция для валидации данных при регистрации
const validateRegistration = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

// Функция для валидации данных при добавлении фильма
const validateMoviePosting = () => celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailerLink: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().custom(validateTitleRU),
    nameEN: Joi.string().required().custom(validateTitleEN),
  }),
});

// Функция для валидации данных при удалении фильма
const validateMovieDeletion = () => celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
});

// Функция для валидации данных при редактировании профиля
const validateProfileEdit = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
});

// Экспорт функций
module.exports = {
  validateLogin,
  validateRegistration,
  validateMoviePosting,
  validateMovieDeletion,
  validateProfileEdit,
};
