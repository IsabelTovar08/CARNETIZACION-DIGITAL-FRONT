// export const environment = {
//   URL: 'https://localhost:7126'
// };

export const environment = {
  production: true,
  URL: (window as any)['env']?.API_BASE_URL || 'API_BASE_URL=http://localhost:5100',
};
