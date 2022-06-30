const router = require('express').Router();
const { validateMoviePosting, validateMovieDeletion } = require('../utils/validation');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');

// Роут для получения массива фильмов
router.get('/', getMovies);

// Роут для добавления фильма
router.post('/', validateMoviePosting, createMovie);

// Роут для удаления фильма
router.delete('/:movieId', validateMovieDeletion, deleteMovie);

// Экспорт роутинга
module.exports = router;
