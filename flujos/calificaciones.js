import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, headersAuth } from '../utils/config.js';
import { extraerJson } from '../utils/correlacion.js';

export function calificarPizza(token, pizzaId, estrellas) {
  const res = http.post(
    `${BASE_URL}/api/ratings`,
    JSON.stringify({ pizza_id: pizzaId, stars: estrellas }),
    { headers: headersAuth(token), tags: { name: '04_Rating' } }
  );
  check(res, {
    'Rating: status 201': (r) => r.status === 201,
    'Rating: es la pizza correlacionada': (r) => r.status === 201 && extraerJson(r, 'pizza_id') === pizzaId,
    'Rating: estrellas correctas': (r) => r.status === 201 && extraerJson(r, 'stars') === estrellas,
  });
}

export function listarCalificaciones(token) {
  const res = http.get(`${BASE_URL}/api/ratings`, {
    headers: headersAuth(token),
    tags: { name: '05_Listar_Ratings' },
  });
  check(res, {
    'Listar: status 200': (r) => r.status === 200,
    'Listar: devuelve lista': (r) => r.status === 200 && Array.isArray(extraerJson(r, 'ratings')),
  });
}