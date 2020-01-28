const {each} = require('lodash');

const tasks = {
  ...require('./config/gulp/build'),
  ...require('./config/gulp/lint'),
  ...require('./config/gulp/test')
};

each(tasks, (task, name) => {
  exports[name] = task;
});

exports.test = () => {}