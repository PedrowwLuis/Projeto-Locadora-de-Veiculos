import { AppError } from '../lib/AppError.js';

export function exigirPerfil(...perfisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
            return next(new AppError(403, 'Você não tem permissão para executar esta ação'));
        }
        next();
    };
}