export default () => ({
  JWT_SECRET: Buffer.from('digiteam-jwt-secret', 'base64').toString(),
  JWT_ALGORITHM: 'HS256',
  JWT_EXPIRES_IN: '1h',

  JWT_TYPE: 'Bearer',

  JWT_REFRESH_SECRET: Buffer.from(
    'digiteam-jwt-refresh-secret',
    'base64',
  ).toString(),
  JWT_REFRESH_ALGORITHM: 'HS256',
  JWT_REFRESH_EXPIRES_IN: '30d',
});
