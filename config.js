var environments = {
  staging: {
    name: 'staging',
    httpPort: 3000,
    httpsPort: 3001,
    privateKey: 'thisIsASecret',
    maxChecks: 5
  },
  production: {
    name: 'production',
    httpPort: 5000,
    httpsPort: 5001,
    privateKey: 'thisIsAlsoASecret',
    maxChecks: 5
  }
};

var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

var envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging

module.exports = envToExport