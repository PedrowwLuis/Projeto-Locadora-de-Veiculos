import { AppError } from './AppError.js';

const FORMATO_ISO = /^\d{4}-\d{2}-\d{2}/;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATO_PLACA = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;

export function criarValidador() {
  const erros = [];

  return {
    adicionar(campo, mensagem) {
      erros.push({ campo, mensagem });
    },
    lancarSeHouver() {
      if (erros.length > 0) {
        throw new AppError(400, 'Dados inválidos', erros);
      }
    },
  };
}

export function textoValido(valor, { min = 1, max }) {
  if (typeof valor !== 'string') {
    return null;
  }
  const texto = valor.trim();
  if (texto.length < min || texto.length > max) {
    return null;
  }
  return texto;
}

export function emailValido(valor) {
  const texto = textoValido(valor, { min: 5, max: 191 });
  if (!texto) {
    return null;
  }
  const email = texto.toLowerCase();
  return FORMATO_EMAIL.test(email) ? email : null;
}

export function placaValida(valor) {
  if (typeof valor !== 'string') {
    return null;
  }
  const placa = valor.replace(/[\s-]/g, '').toUpperCase();
  return FORMATO_PLACA.test(placa) ? placa : null;
}

export function inteiroValido(valor, { min, max }) {
  let numero = valor;
  if (typeof valor === 'string' && valor.trim() !== '') {
    numero = Number(valor);
  }
  if (!Number.isInteger(numero) || numero < min || numero > max) {
    return null;
  }
  return numero;
}

export function decimalPositivo(valor, max) {
  let numero = valor;
  if (typeof valor === 'string' && valor.trim() !== '') {
    numero = Number(valor.replace(',', '.'));
  }
  if (typeof numero !== 'number' || !Number.isFinite(numero)) {
    return null;
  }
  const arredondado = Math.round(numero * 100) / 100;
  if (arredondado <= 0 || arredondado > max) {
    return null;
  }
  return arredondado;
}

export function dataValida(valor) {
  if (typeof valor !== 'string' || !FORMATO_ISO.test(valor)) {
    return null;
  }
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}
