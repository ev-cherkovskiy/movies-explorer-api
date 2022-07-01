const { celebrate } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { validateLogin, validateRegistration } = require('../utils/validation');

module.exports = (app) => {
  // Роут для входа в систему
  app.post('/signin', celebrate(validateLogin), login);
  // Роут для регистрации
  app.post('/signup', celebrate(validateRegistration), createUser);
  // Использовать мидлвэр с авторизацией для защиты нижеследующих роутов
  app.use(auth);
  // Роутинг для юзер-запросов
  app.use('/users', usersRouter);
  // Роутинг для запроса фильмов
  app.use('/movies', moviesRouter);
};
