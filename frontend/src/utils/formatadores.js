const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatadorDataHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

function doisDigitos(numero) {
  return String(numero).padStart(2, '0');
}

export function formatarMoeda(valor) {
  return formatadorMoeda.format(Number(valor));
}

export function formatarDataHora(iso) {
  if (!iso) {
    return '—';
  }
  return formatadorDataHora.format(new Date(iso));
}

export function dataParaCampo(data) {
  const ano = data.getFullYear();
  const mes = doisDigitos(data.getMonth() + 1);
  const dia = doisDigitos(data.getDate());
  const hora = doisDigitos(data.getHours());
  const minuto = doisDigitos(data.getMinutes());
  return `${ano}-${mes}-${dia}T${hora}:${minuto}`;
}

export function campoParaIso(valor) {
  return new Date(valor).toISOString();
}

export function formatarPlaca(placa) {
  if (/^[A-Z]{3}[0-9]{4}$/.test(placa)) {
    return `${placa.slice(0, 3)}-${placa.slice(3)}`;
  }
  return placa;
}
