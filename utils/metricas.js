import { Trend, Counter, Rate } from 'k6/metrics';

export const tiempoRecomendacion = new Trend('tiempo_recomendacion_pizza', true);
export const pizzasRecomendadas = new Counter('pizzas_recomendadas');
export const loginExitoso = new Rate('login_exitoso');