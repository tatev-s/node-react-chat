const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token =  req.headers['authorization'];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized');
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({ payload: null, err: { code: 400, message: "Auth token is not supplied" } })
  }
};

