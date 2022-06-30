const { Joi, celebrate } = require('celebrate');

const validateLogin = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validateLogin,
};
