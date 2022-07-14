const { isEmail, isURL } = require('validator');

// Кастомная валидация ссылки
const validateURL = (value) => {
  if (!isURL(value, { require_protocol: true })) {
    throw new Error('Неправильный формат ссылки');
  }
  return value;
};

// Кастомная валидация почты
const validateEmail = (value) => {
  if (!isEmail(value, { require_protocol: true })) {
    throw new Error('Неправильный формат почты');
  }
  return value;
};

// Кастомная валидация названия на русском
const validateTitleRU = (value) => {
  const regExp = /[а-яё0-9a-z!?.,;:"-]+\s*/gmi;
  if (!value.match(regExp)) {
    throw new Error('Некорректное название на русском');
  }
  return value;
};

// Кастомная валидация названия на английском
const validateTitleEN = (value) => {
  const regExp = /[a-z0-9!?.,;:"'`-]+\s*/gmi;
  if (!value.match(regExp)) {
    throw new Error('Некорректное название на английском');
  }
  return value;
};

// Экспорт вспомогательных функций
module.exports = {
  validateURL,
  validateEmail,
  validateTitleRU,
  validateTitleEN,
};
