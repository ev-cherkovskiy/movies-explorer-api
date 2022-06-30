// Импорт модели фильма
const Movie = require('../models/movie');

// Импорт классов ошибок
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

// Получение массива фильмов
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      // res.send({ data: movies });
      res.send({ movies });
    })
    .catch((err) => {
      next(err);
    });
};

// Создание нового фильма
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      // res.send({ data: movie });
      res.send({ movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные'));
      } else {
        next(err);
      }
    });
};

// Удаление фильма
const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError('Фильма с таким id не найдено');
    })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Невозможно удалить фильм, созданный другим пользователем');
      }
      return movie.remove()
        .then(() => {
          res.send({ message: 'Фильм удалён' });
        });
    })
    .catch((err) => {
      next(err);
    });
};

// Экспорт контроллеров
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
