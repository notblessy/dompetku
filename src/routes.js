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

routes.get('/', (_, res) => {
  return res.json({ ping: 'pong!' });
});

routes.post('/login', auth.login);

export default routes;
