const path = require('path');

const routes = () => [
  {
    method: 'GET',
    path: '/statics/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file'),
      },
    },
  },
];

module.exports = routes;
