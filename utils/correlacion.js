// Extrae el token CSRF: primero de las cookies del servidor, luego del cuerpo JSON
export function extraerCsrf(resp) {
  for (const nombre in resp.cookies) {
    if (nombre.toLowerCase().includes('csrf') && resp.cookies[nombre].length > 0) {
      return resp.cookies[nombre][0].value;
    }
  }
  try {
    const body = resp.json();
    return body.csrf || body.csrf_token || body.token;
  } catch (e) {
    return undefined;
  }
}

// Extrae un valor del JSON de forma segura (JSONPath estilo k6)
export function extraerJson(resp, ruta) {
  try {
    return resp.json(ruta);
  } catch (e) {
    return undefined;
  }
}