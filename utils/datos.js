import { SharedArray } from 'k6/data';

// SharedArray: los datos se cargan UNA sola vez y se comparten
// entre todos los VUs (no se duplican en memoria por cada usuario virtual)
export const usuarios = new SharedArray('usuarios', function () {
  return JSON.parse(open('../data/usuarios.json'));
});

export const preferencias = new SharedArray('preferencias', function () {
  return JSON.parse(open('../data/preferencias.json'));
});