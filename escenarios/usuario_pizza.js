import { group } from 'k6';
import exec from 'k6/execution';
import { usuarios, preferencias } from '../utils/datos.js';
import { pausa } from '../utils/config.js';
import { visitarHome, login } from '../flujos/auth.js';
import { recomendarPizza } from '../flujos/pizza.js';
import { calificarPizza, listarCalificaciones } from '../flujos/calificaciones.js';

export function flujoUsuarioPizza() {
  // Parametrizacion: cada VU usa un usuario y cada iteracion una preferencia
  const usuario = usuarios[(exec.vu.idInTest - 1) % usuarios.length];
  const pref = preferencias[exec.scenario.iterationInTest % preferencias.length];

  group('01_Home', function () {
    visitarHome();
  });
  pausa(1, 3);

  let token;
  group('02_Login', function () {
    token = login(usuario);
  });
  if (!token) return; // sin token no tiene sentido seguir
  pausa(1, 3);

  let pizzaId;
  group('03_Recomendar_Pizza', function () {
    pizzaId = recomendarPizza(token, pref);
    pausa(1, 2);
    pizzaId = recomendarPizza(token, pref) || pizzaId; // el usuario pide otra
  });
  if (!pizzaId) return;
  pausa(1, 3);

  group('04_Calificar', function () {
    calificarPizza(token, pizzaId, pref.stars);
  });
  pausa(1, 2);

  group('05_Mis_Calificaciones', function () {
    listarCalificaciones(token);
  });
  pausa(1, 2);
}