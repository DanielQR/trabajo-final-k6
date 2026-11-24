import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, headersAuth } from '../utils/config.js';
import { extraerJson } from '../utils/correlacion.js';
import { tiempoRecomendacion, pizzasRecomendadas } from '../utils/metricas.js';

export function recomendarPizza(token, pref) {
  const body = JSON.stringify({
    maxCaloriesPerSlice: pref.maxCaloriesPerSlice,
    mustBeVegetarian: pref.mustBeVegetarian,
    excludedIngredients: [],
    excludedTools: [],
    maxNumberOfToppings: pref.maxNumberOfToppings,
    minNumberOfToppings: pref.minNumberOfToppings,
    customName: '',
  });

  const res = http.post(`${BASE_URL}/api/pizza`, body, {
    headers: headersAuth(token),
    tags: { name: '03_Pizza' },
  });

  const pizzaId = res.status === 200 ? extraerJson(res, 'pizza.id') : undefined; // correlacion
  const nombre = res.status === 200 ? extraerJson(res, 'pizza.name') : undefined;

  tiempoRecomendacion.add(res.timings.duration);
  check(res, {
    'Pizza: status 200': (r) => r.status === 200,
    'Pizza: tiene id': () => pizzaId !== undefined,
    'Pizza: tiene nombre': () => !!nombre,
    'Pizza: responde en < 500ms': (r) => r.timings.duration < 500,
  });
  if (pizzaId) pizzasRecomendadas.add(1);
  return pizzaId;
}