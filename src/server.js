const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/inMemories/AlbumsService');
const albums = require('./api/albums');
const albumsValidator = require('./validator/albums');

const init = async () => {
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });


  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: albumsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
