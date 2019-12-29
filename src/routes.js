import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserContorller';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewarers/auth';

const routes = new Router();
const upload = multer(multerConfig);

// Rotas
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// Global, executa em todos as rotas abaixo
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
