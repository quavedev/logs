Package.describe({
  name: 'quave:logs',
  version: '0.0.1',
  summary: 'Utility package to send logs from client and server to loggly',
  git: 'https://github.com/quavedev/logs',
});

Package.onUse(function(api) {
  api.versionsFrom('1.8.2');
  api.use(['ecmascript']);

  api.use('quave:settings@0.0.1');

  api.mainModule('logger.js', 'server');
  api.mainModule('loggerClient.js', 'client');
});
