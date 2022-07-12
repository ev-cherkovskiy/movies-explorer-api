const router = require('express').Router();
const { celebrate } = require('celebrate');
const { validateMoviePosting, validateMovieDeletion } = require('../utils/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// Роут для получения массива фильмов
router.get('/', getMovies);

// Роут для добавления фильма
router.post('/', celebrate(validateMoviePosting), createMovie);

// Роут для удаления фильма
router.delete('/:movieId', celebrate(validateMovieDeletion), deleteMovie);

// Экспорт роутинга
module.exports = router;
