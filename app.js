const express = require('express');
const mongoose = require('mongoose');
const { errors, Joi, celebrate } = require('celebrate');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();

const { PORT = 3000, DB_PATH } = process.env;

// Импорт логгеров, мидлвэров, роутов и т.д.
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const { NotFoundError } = require('./errors/NotFoundError');

// Инициация приложения и подключение БД
const app = express();
mongoose.connect(DB_PATH);

// Использовать вспомогательные инструменты для работы с CORS и для обработки тела запроса
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Использовать логгер запросов
app.use(requestLogger);

// Роут для входа в систему
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

// Роут для регистрации
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser,
);

// Использовать мидлвэр с авторизацией для защиты нижеследующих роутов
app.use(auth);

// Роутинг для юзер-запросов
app.use('/users', usersRouter);

// Роутинг для запроса фильмов
app.use('/movies', moviesRouter);

// Использовать проверку на неправильный путь
app.use((req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

// Использовать логгер ошибок
app.use(errorLogger);

// Использовать обработку ошибок с помощью celebrate и централизованный обработчик ошибок
app.use(errors());
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = (statusCode === 500) ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
});

// Запуск приложения
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Приложение запущено на порту ${PORT}`);
});
