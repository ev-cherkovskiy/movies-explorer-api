const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Импорт классов ошибок
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');

// Получение данных из переменной окружения
const { NODE_ENV, JWT_SECRET } = process.env;

// Получение информации о пользователе
const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не найдено');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

// Редактирование имени и почты пользователя
const editProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user && !user._id.equals(req.user._id)) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })
    .then(() => {
      User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true },
      )
        .then((user) => res.send({ user }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Создание нового пользователя
const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => {
      User.create({ name, email, password: hash })
        .then(() => {
          res.send({ name, email });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    // .catch(next);
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Вход в систему
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '1d' },
      );
      return token;
    })
    .then((token) => {
      res.send({ message: 'Вход выполнен', token });
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

// Экспорт контроллеров
module.exports = {
  getUserInfo,
  editProfile,
  createUser,
  login,
};
