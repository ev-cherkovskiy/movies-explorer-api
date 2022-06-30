const { Joi, celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');

module.exports = (app) => {
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
};
