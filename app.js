const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const { PORT = 3000, DB_PATH } = process.env;

// Импорт логгеров, роутов и т.д.
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');
const { NotFoundError } = require('./errors/NotFoundError');

// Инициация приложения и подключение БД
const app = express();
const databasePath = DB_PATH || 'mongodb://localhost:27017/moviesdb';
mongoose.connect(databasePath);

// Использовать вспомогательные инструменты для работы с CORS и для обработки тела запроса
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Использовать логгер запросов
app.use(requestLogger);

// Ипспользовать единый роутинг
router(app);

// Использовать проверку на неправильный путь
app.use((req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

// Использовать логгер ошибок
app.use(errorLogger);

// Использовать обработку ошибок с помощью celebrate и централизованный обработчик ошибок
app.use(errors());
app.use((err, req, res) => {
  const statusCode = err.statusCode || 500;
  const message = (statusCode === 500) ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
});

// Запуск приложения
// app.listen(PORT, () => {
//   console.log(`Приложение запущено на порту ${PORT}`);
// });
app.listen(PORT);
