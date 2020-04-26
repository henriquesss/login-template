const jwt = require('jsonwebtoken');
const secret = process.env.AUTH_HASH;

const utils = {
  handleAuth(req, res, next) {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;
    const authHash = req.headers.authorization
    let isValid = true;
    if (!token) {
      res.status(401).send('Unauthorized: No token provided');
      return false;
    } else {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          isValid = false
        } else {
          req.email = decoded.email;
          req.loggedUser = decoded.loggedUser;
        }
      });
    }
    if (!authHash || authHash !== process.env.AUTH_HASH) {
      isValid = false
    }
    if (!isValid) {
      res.status(401).send('Unauthorized: Invalid token');
      return false;
    }
    else
      return next();
  },
  generatePassword() {
    var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  },
}

module.exports = utils;