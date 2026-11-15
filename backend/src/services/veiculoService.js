import { AppError } from '../lib/AppError.js';
import { prisma } from '../lib/prisma.js';
import {
  criarValidador,
  decimalPositivo,
  inteiroValido,
  placaValida,
  textoValido,
} from '../lib/validacao.js';

const ANO_MINIMO = 1950;
const VALOR_DIARIA_MAXIMO = 99999999.99;

export async function cadastrar(dados) {
  const validador = criarValidador();

  const marca = textoValido(dados.marca, { max: 60 });
  if (!marca) {
    validador.adicionar('marca', 'Marca é obrigatória (até 60 caracteres)');
  }

  const modelo = textoValido(dados.modelo, { max: 60 });
  if (!modelo) {
    validador.adicionar('modelo', 'Modelo é obrigatório (até 60 caracteres)');
  }

  const placa = placaValida(dados.placa);
  if (!placa) {
    validador.adicionar('placa', 'Placa inválida. Use o formato ABC1234 ou ABC1D23');
  }

  const anoMaximo = new Date().getFullYear() + 1;
  const ano = inteiroValido(dados.ano, { min: ANO_MINIMO, max: anoMaximo });
  if (!ano) {
    validador.adicionar('ano', `Ano deve ser um inteiro entre ${ANO_MINIMO} e ${anoMaximo}`);
  }

  const valorDiaria = decimalPositivo(dados.valorDiaria, VALOR_DIARIA_MAXIMO);
  if (!valorDiaria) {
    validador.adicionar('valorDiaria', 'Valor da diária deve ser um número positivo');
  }

  validador.lancarSeHouver();

  const existente = await prisma.veiculo.findUnique({ where: { placa } });
  if (existente) {
    throw new AppError(409, 'Já existe um veículo cadastrado com esta placa');
  }

  return prisma.veiculo.create({
    data: { marca, modelo, placa, ano, valorDiaria, disponivel: true },
  });
}

export async function listar({ disponivel } = {}) {
  let filtro = {};

  if (disponivel !== undefined) {
    if (disponivel !== 'true' && disponivel !== 'false') {
      throw new AppError(400, 'O filtro "disponivel" aceita apenas true ou false');
    }
    filtro = { disponivel: disponivel === 'true' };
  }

  return prisma.veiculo.findMany({
    where: filtro,
    orderBy: [{ marca: 'asc' }, { modelo: 'asc' }],
  });
}

export async function listarDisponiveis() {
  return listar({ disponivel: 'true' });
}
