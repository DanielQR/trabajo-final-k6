export const thresholds = {
  // Globales (criterios de exito del trabajo)
  http_req_failed: ['rate<0.01'],
  http_req_duration: ['p(95)<500', 'p(99)<1000'],
  checks: ['rate>0.99'],

  // Por transaccion critica
  'http_req_duration{name:02b_Login}': ['p(95)<500'],
  'http_req_duration{name:03_Pizza}': ['p(95)<500'],
  'http_req_duration{name:04_Rating}': ['p(95)<500'],

  // Metricas de negocio
  login_exitoso: ['rate>0.99'],
  tiempo_recomendacion_pizza: ['p(95)<500'],
};