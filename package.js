Package.describe({
  name: 'quave:logs',
  version: '1.0.8',
  summary: 'Utility package to send logs from client and server to loggly',
  git: 'https://github.com/quavedev/logs',
});

Package.onUse(function(api) {
  api.versionsFrom('1.10.2');
  api.use(['ecmascript']);

  api.use(['ddp-server'], 'server');

  api.use('quave:settings@1.0.0');

  api.mainModule('logger.js', 'server');
  api.mainModule('loggerClient.js', 'client');
});
