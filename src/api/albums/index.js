const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { albumsService, storageService, validator }) => {
    const handler = new AlbumsHandler(albumsService, storageService, validator);
    server.route(routes(handler));
  },
};
