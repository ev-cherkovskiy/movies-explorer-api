const rateLimit = require('express-rate-limit');

// 100 запросов в 5 минут максимум
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standartHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiter,
};
