const router = require('express').Router();
const { validateProfileEdit } = require('../utils/validation');
const { getUserInfo, editProfile } = require('../controllers/users');

// Роут для получения информации о пользователе
router.get('/me', getUserInfo);

// Роут для изменения информации о пользователе
router.patch('/me', validateProfileEdit, editProfile);

// Экспорт роутинга
module.exports = router;
