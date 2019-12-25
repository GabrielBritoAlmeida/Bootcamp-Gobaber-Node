import { Router } from 'express';

import UserController from './app/controllers/UserContorller';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewarers/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Global, executa em todos as rotas abaixo
routes.use(authMiddleware);

routes.put('/users', UserController.update);

export default routes;
