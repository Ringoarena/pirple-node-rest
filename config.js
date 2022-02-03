var environments = {
  staging: {
    name: 'staging',
    httpPort: 3000,
    httpsPort: 3001,
    privateKey: 'thisIsASecret',
    maxChecks: 5,
    twilio: {
      accountId: 'ACb32d411ad7fe886aac54c665d25e5c5d',
      authToken: '9455e3eb3109edc12e3d8c92768f7a67',
      fromPhone: '+15005550006',
    }
  },
  production: {
    name: 'production',
    httpPort: 5000,
    httpsPort: 5001,
    privateKey: 'thisIsAlsoASecret',
    maxChecks: 5,
    twilio: {
      accountId: '',
      fromPhone: '',
      authToken: ''
    }
  }
};

var currentEnv = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : ''

var envToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging

module.exports = envToExport