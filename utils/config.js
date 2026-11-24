import { sleep } from 'k6';
import exec from 'k6/execution';

export const BASE_URL = __ENV.BASE_URL || 'http://localhost:3333';

export const HEADERS_JSON = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export function headersAuth(token) {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Think time: simula la pausa real del usuario.
// En la prueba de estres se reduce para presionar mas al sistema.
export function pausa(min, max) {
  const factor = exec.scenario.name === 'estres' ? 0.25 : 1;
  sleep((min + Math.random() * (max - min)) * factor);
}