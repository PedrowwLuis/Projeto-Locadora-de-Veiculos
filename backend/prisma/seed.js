import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EMAIL_ADMIN = 'admin@projeto-locadora-de-veiculos.com';
const SENHA_ADMIN = 'Admin@123';
const EMAIL_DEMO = 'demo@projeto-locadora-de-veiculos.com';
const SENHA_DEMO = 'Demo@123';
const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

const veiculosIniciais = [
  { marca: 'Fiat', modelo: 'Mobi', placa: 'ABC1D23', ano: 2023, valorDiaria: 120 },
  { marca: 'Volkswagen', modelo: 'Gol', placa: 'BRA2E19', ano: 2022, valorDiaria: 135 },
  { marca: 'Chevrolet', modelo: 'Onix', placa: 'CDE3F45', ano: 2024, valorDiaria: 160 },
  { marca: 'Hyundai', modelo: 'HB20', placa: 'FGH4I67', ano: 2023, valorDiaria: 165 },
  { marca: 'Toyota', modelo: 'Corolla', placa: 'IJK5L89', ano: 2024, valorDiaria: 280 },
  { marca: 'Jeep', modelo: 'Renegade', placa: 'LMN6O01', ano: 2023, valorDiaria: 320 },
  { marca: 'Renault', modelo: 'Kwid', placa: 'OPQ7R23', ano: 2022, valorDiaria: 110 },
  { marca: 'Honda', modelo: 'Civic', placa: 'RST8U45', ano: 2024, valorDiaria: 300 },
];

async function criarUsuario({ nome, email, senha, perfil }) {
  const senhaHash = await bcrypt.hash(senha, 10);

  return prisma.usuario.upsert({
    where: { email },
    update: { perfil },
    create: { nome, email, senhaHash, perfil },
  });
}

async function criarVeiculos() {
  const veiculos = [];

  for (const dados of veiculosIniciais) {
    const veiculo = await prisma.veiculo.upsert({
      where: { placa: dados.placa },
      update: {},
      create: { ...dados, disponivel: true },
    });
    veiculos.push(veiculo);
  }

  return veiculos;
}

async function criarHistorico(usuario, veiculos) {
  const totalLocacoes = await prisma.locacao.count();
  if (totalLocacoes > 0) {
    return;
  }

  const agora = Date.now();
  const [primeiro, segundo] = veiculos;

  const inicioFinalizada = new Date(agora - 10 * MILISSEGUNDOS_POR_DIA);
  const fimFinalizada = new Date(agora - 7 * MILISSEGUNDOS_POR_DIA);

  await prisma.locacao.create({
    data: {
      usuarioId: usuario.id,
      veiculoId: primeiro.id,
      dataInicio: inicioFinalizada,
      dataPrevistaDevolucao: fimFinalizada,
      dataDevolucaoEfetiva: fimFinalizada,
      valorTotal: Number(primeiro.valorDiaria) * 3,
      status: 'FINALIZADA',
    },
  });

  const inicioAtiva = new Date(agora - 1 * MILISSEGUNDOS_POR_DIA);
  const fimAtiva = new Date(agora + 3 * MILISSEGUNDOS_POR_DIA);

  await prisma.$transaction([
    prisma.locacao.create({
      data: {
        usuarioId: usuario.id,
        veiculoId: segundo.id,
        dataInicio: inicioAtiva,
        dataPrevistaDevolucao: fimAtiva,
        valorTotal: Number(segundo.valorDiaria) * 4,
        status: 'ATIVA',
      },
    }),
    prisma.veiculo.update({
      where: { id: segundo.id },
      data: { disponivel: false },
    }),
  ]);
}

async function main() {
  await criarUsuario({
    nome: 'Administrador',
    email: EMAIL_ADMIN,
    senha: SENHA_ADMIN,
    perfil: 'ADMIN',
  });
  const usuarioDemo = await criarUsuario({
    nome: 'Usuário Demonstração',
    email: EMAIL_DEMO,
    senha: SENHA_DEMO,
    perfil: 'USUARIO',
  });
  const veiculos = await criarVeiculos();
  await criarHistorico(usuarioDemo, veiculos);

  console.log(`Seed concluído.`);
  console.log(`Administrador: ${EMAIL_ADMIN} / ${SENHA_ADMIN}`);
  console.log(`Usuário comum: ${EMAIL_DEMO} / ${SENHA_DEMO}`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });