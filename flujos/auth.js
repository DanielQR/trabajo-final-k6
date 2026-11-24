import http from 'k6/http';
import { check } from 'k6';
import { BASE_URL, HEADERS_JSON } from '../utils/config.js';
import { extraerCsrf, extraerJson } from '../utils/correlacion.js';
import { loginExitoso } from '../utils/metricas.js';
import { usuarios } from '../utils/datos.js';

// Se ejecuta en setup(): registra los usuarios de prueba (si ya existen, se ignoran)
export function registrarUsuarios() {
  let creados = 0;
  for (let i = 0; i < usuarios.length; i++) {
    const u = usuarios[i];
    const res = http.post(
      `${BASE_URL}/api/users`,
      JSON.stringify({ username: u.username, password: u.password }),
      {
        headers: HEADERS_JSON,
        tags: { name: '00_Setup_Registro' },
        responseCallback: http.expectedStatuses({ min: 200, max: 499 }),
      }
    );
    if (res.status === 201) creados++;
  }
  console.log(`[SETUP] Usuarios nuevos: ${creados} de ${usuarios.length} (el resto ya existia)`);
}

export function visitarHome() {
  const res = http.get(`${BASE_URL}/`, { tags: { name: '01_Home' } });
  check(res, {
    'Home: status 200': (r) => r.status === 200,
    'Home: contiene QuickPizza': (r) => r.body && r.body.includes('QuickPizza'),
  });
}

// Login con correlacion: CSRF -> login -> token
export function login(usuario) {
  const csrfRes = http.post(`${BASE_URL}/api/csrf-token`, null, {
    headers: { Accept: '*/*', Origin: BASE_URL },
    tags: { name: '02a_CSRF' },
  });
  const csrf = extraerCsrf(csrfRes);

  const body = { username: usuario.username, password: usuario.password };
  if (csrf) body.csrf = csrf; // correlacion del CSRF

  const res = http.post(
    `${BASE_URL}/api/users/token/login?set_cookie=true`,
    JSON.stringify(body),
    { headers: Object.assign({}, HEADERS_JSON, { Origin: BASE_URL }), tags: { name: '02b_Login' } }
  );

  const token = res.status === 200 ? extraerJson(res, 'token') : undefined;

  check(res, {
    'Login: status 200': (r) => r.status === 200,
    'Login: token recibido': () => !!token,
    'Login: responde en < 500ms': (r) => r.timings.duration < 500,
  });
  loginExitoso.add(!!token);
  return token;
}