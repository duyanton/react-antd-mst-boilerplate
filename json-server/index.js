// Code example from https://www.techiediaries.com/fake-api-jwt-json-server/

const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');

const generateData = require('./generateData');

const db = generateData();

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();
server.use(middlewares);
server.use(jsonServer.bodyParser);

const SECRET_KEY = 'react-antd-mst-boilerplate';
const expiresIn = '1y';

// Create JWT token
const createToken = payload => jwt.sign(payload, SECRET_KEY, { expiresIn });

// Decode and verify token
const verifyToken = token =>
  jwt.verify(token, SECRET_KEY, (err, decode) => (decode !== undefined ? decode : err));

// Find a user in database by email and password
const findUser = ({ email, password }) => {
  const index = db.users.findIndex(user => user.email === email && user.password === password);
  if (index === -1) return undefined;
  return db.users[index];
};

// Check if user exists
const isAuthenticated = ({ email, password }) => !!findUser({ email, password });

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (isAuthenticated({ email, password }) === false) {
    const status = 401;
    const message = 'Incorrect email or password';
    res.status(status).json({ status, message });
    return;
  }

  const user = findUser({ email, password });
  const access_token = createToken({ id: user.id, email: user.email, role: user.role });
  res.status(200).json(Object.assign({}, user, { access_token }));
});

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  if (
    req.headers.authorization === undefined ||
    req.headers.authorization.split(' ')[0] !== 'Bearer'
  ) {
    const status = 401;
    const message = 'Bad authorization header';
    res.status(status).json({ status, message });
    return;
  }
  try {
    verifyToken(req.headers.authorization.split(' ')[1]);
    next();
  } catch (err) {
    const status = 401;
    const message = 'Error: access token is not valid';
    res.status(status).json({ status, message });
  }
});

server.use(router);
server.listen(4000, () => {
  console.log('JSON Server is running');
});
