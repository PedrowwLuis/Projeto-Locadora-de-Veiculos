import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { autenticar } from '../middlewares/autenticar.js';
import * as veiculoController from '../controllers/veiculoController.js';

export const veiculoRoutes = Router();

veiculoRoutes.use(autenticar);

veiculoRoutes.post('/', asyncHandler(veiculoController.cadastrar));
veiculoRoutes.get('/', asyncHandler(veiculoController.listar));
veiculoRoutes.get('/disponiveis', asyncHandler(veiculoController.listarDisponiveis));
