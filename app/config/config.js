module.exports = {
  development: {
    storage: 'db.development.sqlite',
    dialect: 'sqlite',
    operatorsAliases: false,
  },
  test: {
    storage: ':memory:',
    dialect: 'sqlite',
    operatorsAliases: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    // dialect: 'postgres',
    // dialectOptions: { ssl: true },
    // operatorsAliases: false,
  },
  // production: {
  //   username: process.env.DB_USER,
  //   password: process.env.DB_PASS,
  //   database: process.env.DB_NAME,
  //   host: process.env.DB_HOST,
  //   dialect: 'postgres',
  //   operatorsAliases: false,
  // },
};
