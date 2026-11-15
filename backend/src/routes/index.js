import { Router } from 'express';
import { authRoutes } from './authRoutes.js';
import { veiculoRoutes } from './veiculoRoutes.js';
import { locacaoRoutes } from './locacaoRoutes.js';

export const routes = Router();

routes.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

routes.use('/auth', authRoutes);
routes.use('/veiculos', veiculoRoutes);
routes.use('/locacoes', locacaoRoutes);
