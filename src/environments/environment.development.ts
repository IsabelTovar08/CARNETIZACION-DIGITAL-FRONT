// export const environment = {
//   URL: 'https://localhost:7126'
// };

/// <summary>
/// Configuración global de entorno Angular.
/// </summary>
export const environment = {
  production: true,
  API_BASE_URL: (window as any)['env']?.API_BASE_URL || ''
};
