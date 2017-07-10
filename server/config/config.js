require('dotenv').config();

module.exports = {
  development: {
    username: 'andeladeveloper',
    password: null,
    database: 'dms-dev',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres'
  },
  test: {
    username: 'andeladeveloper',
    password: null,
    database: 'dms-test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    ssl: true,
    'dialectOptions': {
      'ssl': {
        'require': true
      }
    }
  },
  travis: {
    use_env_variable: 'DATABASE_URL'
  }
};
