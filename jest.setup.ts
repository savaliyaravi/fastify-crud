process.env['JWT_SECRET'] = process.env['JWT_SECRET'] || 'test_secret';
process.env['JWT_EXPIRY'] = process.env['JWT_EXPIRY'] || '2m';
process.env['API_PREFIX'] = process.env['API_PREFIX'] || '/api';
process.env['NODE_ENV'] = process.env['NODE_ENV'] || 'test';

export {};


