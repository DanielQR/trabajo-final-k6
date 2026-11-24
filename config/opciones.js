import { perfiles } from './perfiles.js';
import { thresholds } from './thresholds.js';

export function crearOpciones(nombre) {
  const scenarios = {};
  scenarios[nombre] = perfiles[nombre];
  return { scenarios: scenarios, thresholds: thresholds };
}