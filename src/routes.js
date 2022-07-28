import { Router } from 'express';
import expressJWT from 'express-jwt';

import config from './config';

import * as auth from './controllers/auth';
import * as user from './controllers/user';
import * as category from './controllers/category';
import * as currency from './controllers/currency';
import * as subCategory from './controllers/sub_category';
import * as wallet from './controllers/wallet';
import * as budget from './controllers/budget';

const routes = Router();

const jwtMiddleware = expressJWT({
  secret: config.JWT_SECRET,
  algorithms: [config.JWT_ALGORITHM],
  issuer: config.JWT_ISSUER,
});

routes.get('/', (_, res) => {
  return res.json({ ping: 'pong!' });
});

routes.post('/admin/login', auth.loginAdmin);

routes.post('/login', auth.login);
routes.get('/profile', jwtMiddleware, auth.profile);
routes.put('/profile', jwtMiddleware, auth.edit);

routes.post('/users/add', auth.addUser);
routes.get('/users', jwtMiddleware, user.all);

routes.get('/categories', jwtMiddleware, category.all);
routes.get('/categories/:id', jwtMiddleware, category.detail);
routes.post('/categories', jwtMiddleware, category.create);
routes.post('/categories/bulk', jwtMiddleware, category.bulkCreate);
routes.put('/categories/:id', jwtMiddleware, category.edit);
routes.delete('/categories', jwtMiddleware, category.destroy);

routes.get('/currencies', jwtMiddleware, currency.all);
routes.get('/currencies/:id', jwtMiddleware, currency.detail);
routes.post('/currencies', jwtMiddleware, currency.create);
routes.put('/currencies/:id', jwtMiddleware, currency.edit);
routes.delete('/currencies', jwtMiddleware, currency.destroy);

routes.get('/sub_categories', jwtMiddleware, subCategory.all);
routes.get('/sub_categories/:id', jwtMiddleware, subCategory.detail);
routes.post('/sub_categories', jwtMiddleware, subCategory.create);
routes.put('/sub_categories/:id', jwtMiddleware, subCategory.edit);
routes.delete('/sub_categories', jwtMiddleware, subCategory.destroy);

routes.get('/wallets', jwtMiddleware, wallet.all);
routes.get('/wallets/:id', jwtMiddleware, wallet.detail);
routes.post('/wallets', jwtMiddleware, wallet.create);
routes.put('/wallets/:id', jwtMiddleware, wallet.edit);
routes.delete('/wallets', jwtMiddleware, wallet.destroy);

routes.get('/budgets', jwtMiddleware, budget.all);
routes.get('/budgets/:id', jwtMiddleware, budget.detail);
routes.post('/budgets', jwtMiddleware, budget.create);
routes.put('/budgets/:id', jwtMiddleware, budget.edit);
routes.delete('/budgets', jwtMiddleware, budget.destroy);

export default routes;
