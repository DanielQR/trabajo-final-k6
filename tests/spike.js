import { crearOpciones } from '../config/opciones.js';
import { registrarUsuarios } from '../flujos/auth.js';
import { flujoUsuarioPizza } from '../escenarios/usuario_pizza.js';
import { generarResumen } from '../utils/resumen.js';

export const options = crearOpciones('spike');

export function setup() {
  registrarUsuarios();
}

export default function () {
  flujoUsuarioPizza();
}

export function handleSummary(data) {
  return generarResumen(data, 'spike');
}