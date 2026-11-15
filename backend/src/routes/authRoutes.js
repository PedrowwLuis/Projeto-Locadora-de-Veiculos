import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { autenticar } from '../middlewares/autenticar.js';
import * as authController from '../controllers/authController.js';

export const authRoutes = Router();

authRoutes.post('/cadastro', asyncHandler(authController.cadastrar));
authRoutes.post('/login', asyncHandler(authController.entrar));
authRoutes.get('/perfil', autenticar, asyncHandler(authController.perfil));
