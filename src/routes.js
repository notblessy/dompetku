import { Router } from 'express';
import expressJWT from 'express-jwt';

import config from './config';

import * as auth from './controllers/auth';
import * as category from './controllers/category';

const routes = Router();

const jwtMiddleware = expressJWT({
  secret: config.JWT_SECRET,
  algorithms: [config.JWT_ALGORITHM],
  issuer: 'api.dompetku.id',
});

routes.get('/', (_, res) => {
  return res.json({ ping: 'pong!' });
});

routes.post('/login', auth.login);
routes.get('/profile', jwtMiddleware, auth.profile);
routes.put('/profile', jwtMiddleware, auth.edit);

routes.get('/categories', jwtMiddleware, category.all);
routes.get('/categories/:id', jwtMiddleware, category.detail);
routes.post('/categories', jwtMiddleware, category.create);
routes.put('/categories/:id', jwtMiddleware, category.edit);
routes.delete('/categories', jwtMiddleware, category.destroy);

export default routes;
