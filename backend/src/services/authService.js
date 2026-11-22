import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from '../lib/AppError.js';
import { prisma } from '../lib/prisma.js';
import { criarValidador, emailValido, textoValido } from '../lib/validacao.js';
import { camposPublicos } from './usuarioService.js';

export async function cadastrar(dados) {
  const validador = criarValidador();

  const nome = textoValido(dados.nome, { min: 2, max: 120 });
  if (!nome) {
    validador.adicionar('nome', 'Nome é obrigatório (2 a 120 caracteres)');
  }

  const email = emailValido(dados.email);
  if (!email) {
    validador.adicionar('email', 'E-mail inválido');
  }

  const senha = typeof dados.senha === 'string' ? dados.senha : '';
  if (senha.length < 6 || senha.length > 72) {
    validador.adicionar('senha', 'Senha deve ter entre 6 e 72 caracteres');
  }

  validador.lancarSeHouver();

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    throw new AppError(409, 'Já existe um usuário cadastrado com este e-mail');
  }

  const senhaHash = await bcrypt.hash(senha, env.bcryptRounds);

  return prisma.usuario.create({
    data: { nome, email, senhaHash, perfil: 'USUARIO' },
    select: camposPublicos,
  });

}

export async function entrar(dados) {
  const email = emailValido(dados.email);
  const senha = typeof dados.senha === 'string' ? dados.senha : '';

  if (!email || !senha) {
    throw new AppError(400, 'Informe e-mail e senha');
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const credenciaisCorretas = usuario ? await bcrypt.compare(senha, usuario.senhaHash) : false;

  if (!credenciaisCorretas) {
    throw new AppError(401, 'E-mail ou senha incorretos');
  }

  const token = jwt.sign({}, env.jwtSecret, {
    subject: String(usuario.id),
    expiresIn: env.jwtExpiresIn,
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil: usuario.perfil,
      criadoEm: usuario.criadoEm,
    },
  };
}
