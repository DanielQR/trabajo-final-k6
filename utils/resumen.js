import { textSummary } from 'https://jslib.k6.io/k6-summary/0.1.0/index.js';

export function generarResumen(data, nombre) {
  const salida = {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
  salida[`resultados/${nombre}.json`] = JSON.stringify(data, null, 2);
  return salida;
}