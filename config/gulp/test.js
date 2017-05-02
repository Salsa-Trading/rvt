const gulp = require('gulp');
const KarmaServer = require('karma').Server;
const Xvfb = require('xvfb');
const os = require('os');
const karmaOptions = {
  configFile: __dirname + '/../karma.conf.js'
};

// Execute client karma tests in a watch loop
gulp.task('karma', function (done) {
  const xvfb = new Xvfb({silent: true});
  const karmaServer = new KarmaServer(karmaOptions, done);
  const debugUrl = `http://${os.hostname()}:${karmaServer.get('config').port}/debug.html`;
  console.log('Starting headless Chrome. To debug, open \x1b[94m' + debugUrl + '\x1b[0m');
  xvfb.start(function() {
    karmaServer.start();
  });
});

// Execute client karma tests once
gulp.task('karma:run', function (done) {
  const xvfb = new Xvfb({silent: true});
  xvfb.start(function() {
    const karmaServer = new KarmaServer(Object.assign(karmaOptions, {singleRun: true}));

    karmaServer.on('run_complete', function (browsers, results) {
      done(results.error ? 'There are test failures' : null);
    });

    karmaServer.start();
  });
});
