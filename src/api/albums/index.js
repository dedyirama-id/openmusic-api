const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {
    albumsService, storageService, cacheService, validator,
  }) => {
    const handler = new AlbumsHandler(albumsService, storageService, cacheService, validator);
    server.route(routes(handler));
  },
};
