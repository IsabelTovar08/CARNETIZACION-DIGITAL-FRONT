// export const environment = {
//   URL: 'http://localhost:8088',
//   // URL: 'http://192.168.137.1:8008'
// };

export const environment = {
  production: true,
  URL: (window as any)['env']?.API_BASE_URL,
};
