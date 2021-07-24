import { Router } from 'express';
import expressJWT from 'express-jwt';
import jwt from 'jsonwebtoken';

import config from './config';

import * as auth from './controllers/auth';

const routes = Router();

const jwtMiddleware = expressJWT({
  secret: config.JWT_SECRET,
  algorithms: [config.JWT_ALGORITHM],
  issuer: 'api.dompetku.com',
});

const semiRestrictedMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
    });
  }

  next();
};

routes.get('/', (_, res) => {
  return res.json({ ping: 'pong!' });
});

routes.post('/login', auth.login);
routes.get('/profile', jwtMiddleware, auth.profile);
routes.put('/profile', jwtMiddleware, auth.edit);
routes.get('/profile/address', jwtMiddleware, address.detail);
routes.post('/profile/address', jwtMiddleware, address.upsert);
routes.get('/profile/bank', jwtMiddleware, bank.byUser);
routes.post('/profile/banks', jwtMiddleware, bank.upsert);

export default routes;
