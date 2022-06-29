const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { validateEmail } = require('../utils/utils');

// Импорт контроллеров
const { getUserInfo, editProfile } = require('../controllers/users');

// Роут для получения информации о пользователе
router.get('/me', getUserInfo);

// Роут для изменения информации о пользователе
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().custom(validateEmail),
    }),
  }),
  editProfile,
);

// Экспорт роутинга
module.exports = router;
