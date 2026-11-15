import { Prisma } from '@prisma/client';
import { AppError } from '../lib/AppError.js';
import { prisma } from '../lib/prisma.js';
import { criarValidador, dataValida, inteiroValido } from '../lib/validacao.js';

const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;
const ID_MAXIMO = 2147483647;
const STATUS_VALIDOS = ['ATIVA', 'FINALIZADA'];

const incluirVeiculo = {
  veiculo: {
    select: {
      id: true,
      marca: true,
      modelo: true,
      placa: true,
      ano: true,
      valorDiaria: true,
    },
  },
};

function calcularDiarias(dataInicio, dataPrevistaDevolucao) {
  const duracao = dataPrevistaDevolucao.getTime() - dataInicio.getTime();
  return Math.ceil(duracao / MILISSEGUNDOS_POR_DIA);
}

function validarId(valor, mensagem) {
  const id = inteiroValido(valor, { min: 1, max: ID_MAXIMO });
  if (!id) {
    throw new AppError(400, mensagem);
  }
  return id;
}

export async function registrar(usuarioId, dados) {
  const validador = criarValidador();

  const veiculoId = inteiroValido(dados.veiculoId, { min: 1, max: ID_MAXIMO });
  if (!veiculoId) {
    validador.adicionar('veiculoId', 'Informe o veículo a ser locado');
  }

  const dataInicio = dataValida(dados.dataInicio);
  if (!dataInicio) {
    validador.adicionar('dataInicio', 'Data de início inválida');
  }

  const dataPrevistaDevolucao = dataValida(dados.dataPrevistaDevolucao);
  if (!dataPrevistaDevolucao) {
    validador.adicionar('dataPrevistaDevolucao', 'Data prevista de devolução inválida');
  }

  if (dataInicio && dataPrevistaDevolucao && dataPrevistaDevolucao <= dataInicio) {
    validador.adicionar(
      'dataPrevistaDevolucao',
      'A data prevista de devolução deve ser posterior à data de início',
    );
  }

  validador.lancarSeHouver();

  return prisma.$transaction(async (tx) => {
    const veiculo = await tx.veiculo.findUnique({ where: { id: veiculoId } });
    if (!veiculo) {
      throw new AppError(404, 'Veículo não encontrado');
    }
    if (!veiculo.disponivel) {
      throw new AppError(409, 'Veículo indisponível: já existe uma locação ativa para ele');
    }

    const diarias = calcularDiarias(dataInicio, dataPrevistaDevolucao);
    const valorTotal = new Prisma.Decimal(veiculo.valorDiaria).mul(diarias);

    const reserva = await tx.veiculo.updateMany({
      where: { id: veiculoId, disponivel: true },
      data: { disponivel: false },
    });
    if (reserva.count === 0) {
      throw new AppError(409, 'Veículo indisponível: outra locação foi registrada ao mesmo tempo');
    }

    return tx.locacao.create({
      data: {
        usuarioId,
        veiculoId,
        dataInicio,
        dataPrevistaDevolucao,
        valorTotal,
        status: 'ATIVA',
      },
      include: incluirVeiculo,
    });
  });
}

export async function listarDoUsuario(usuarioId, { status } = {}) {
  const filtro = { usuarioId };

  if (status !== undefined) {
    if (!STATUS_VALIDOS.includes(status)) {
      throw new AppError(400, 'O filtro "status" aceita apenas ATIVA ou FINALIZADA');
    }
    filtro.status = status;
  }

  return prisma.locacao.findMany({
    where: filtro,
    include: incluirVeiculo,
    orderBy: [{ dataInicio: 'desc' }, { id: 'desc' }],
  });
}

export async function buscarDoUsuario(usuarioId, idInformado) {
  const id = validarId(idInformado, 'Identificador de locação inválido');

  const locacao = await prisma.locacao.findUnique({
    where: { id },
    include: incluirVeiculo,
  });

  if (!locacao) {
    throw new AppError(404, 'Locação não encontrada');
  }
  if (locacao.usuarioId !== usuarioId) {
    throw new AppError(403, 'Você não tem permissão para acessar esta locação');
  }

  return locacao;
}

export async function finalizar(usuarioId, idInformado) {
  const id = validarId(idInformado, 'Identificador de locação inválido');

  return prisma.$transaction(async (tx) => {
    const locacao = await tx.locacao.findUnique({ where: { id } });

    if (!locacao) {
      throw new AppError(404, 'Locação não encontrada');
    }
    if (locacao.usuarioId !== usuarioId) {
      throw new AppError(403, 'Você não tem permissão para finalizar esta locação');
    }
    if (locacao.status === 'FINALIZADA') {
      throw new AppError(409, 'Esta locação já foi finalizada');
    }

    const encerramento = await tx.locacao.updateMany({
      where: { id, status: 'ATIVA' },
      data: { status: 'FINALIZADA', dataDevolucaoEfetiva: new Date() },
    });
    if (encerramento.count === 0) {
      throw new AppError(409, 'Esta locação já foi finalizada');
    }

    await tx.veiculo.update({
      where: { id: locacao.veiculoId },
      data: { disponivel: true },
    });

    return tx.locacao.findUnique({ where: { id }, include: incluirVeiculo });
  });
}
