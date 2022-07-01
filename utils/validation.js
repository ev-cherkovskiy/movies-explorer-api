const { Joi } = require('celebrate');
const {
  validateURL,
  validateEmail,
  validateTitleRU,
  validateTitleEN,
} = require('./utils');

// Схема для валидации данных при входе в систему
const validateLogin = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

// Схема для валидации данных при регистрации
const validateRegistration = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
};

// Схема для валидации данных при добавлении фильма
const validateMoviePosting = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL),
    trailerLink: Joi.string().required().custom(validateURL),
    thumbnail: Joi.string().required().custom(validateURL),
    movieId: Joi.number().strict().integer().required(),
    nameRU: Joi.string().required().custom(validateTitleRU),
    nameEN: Joi.string().required().custom(validateTitleEN),
  }),
};

// Схема для валидации данных при удалении фильма
const validateMovieDeletion = {
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
};

// СХема для валидации данных при редактировании профиля
const validateProfileEdit = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().custom(validateEmail),
  }),
};

// Экспорт схем
module.exports = {
  validateLogin,
  validateRegistration,
  validateMoviePosting,
  validateMovieDeletion,
  validateProfileEdit,
};
