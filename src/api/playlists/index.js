const SongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {
    playlistsService, usersService, songsService, cacheService, validator,
  }) => {
    // eslint-disable-next-line max-len
    const handler = new SongsHandler(playlistsService, usersService, songsService, cacheService, validator);
    server.route(routes(handler));
  },
};
