import 'dotenv/config';

const obrigatorias = ['DATABASE_URL', 'JWT_SECRET'];
const ausentes = obrigatorias.filter((nome) => !process.env[nome]);

if (ausentes.length > 0) {
  throw new Error(`Variáveis de ambiente ausentes: ${ausentes.join(', ')}`);
}

export const env = {
  port: Number(process.env.PORT) || 3333,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
  frontendUrls: (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
};
