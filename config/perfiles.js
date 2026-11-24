export const perfiles = {
  // Smoke: valida que el script funciona
  smoke: { executor: 'constant-vus', vus: 2, duration: '1m' },

  // Carga sostenida: uso normal esperado (6 min)
  carga: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 50 },
      { duration: '4m', target: 50 },
      { duration: '1m', target: 0 },
    ],
  },

  // Spike: subida brusca, como en una promocion (~4.5 min)
  spike: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '30s', target: 20 },
      { duration: '1m', target: 20 },
      { duration: '15s', target: 400 },
      { duration: '1m', target: 400 },
      { duration: '15s', target: 20 },
      { duration: '1m', target: 20 },
      { duration: '15s', target: 0 },
    ],
  },

  // Estres: escalones crecientes hasta buscar el punto de quiebre (~11 min)
  estres: {
    executor: 'ramping-vus',
    startVUs: 0,
    stages: [
      { duration: '1m', target: 100 },
      { duration: '1m30s', target: 100 },
      { duration: '1m', target: 300 },
      { duration: '1m30s', target: 300 },
      { duration: '1m', target: 600 },
      { duration: '1m30s', target: 600 },
      { duration: '1m', target: 1000 },
      { duration: '1m30s', target: 1000 },
      { duration: '1m', target: 0 },
    ],
  },
};