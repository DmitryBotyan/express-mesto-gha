const jwt = require('../node_modules/jsonwebtoken');
const { AuthError } = require('./error');

// eslint-disable-next-line consistent-return
const auth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return new AuthError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');

    let payload;

    try {
      payload = jwt.verify(token, 'some-secret-key');
    } catch {
      next(new AuthError('Необходима авторизация'));
    }
    req.user = payload;
    next();
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
};

module.exports = { auth };
