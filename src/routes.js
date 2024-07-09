const { deleteAlbumByIdHandler } = require('./handler');
const { putAlbumByIdHandler } = require('./handler');
const { getAlbumByIdHandler } = require('./handler');
const { postAlbumHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/albums',
    handler: postAlbumHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: getAlbumByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: putAlbumByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: deleteAlbumByIdHandler,
  },
  {
    method: 'POST',
    path: '/songs',
    handler: () => { },
  },
  {
    method: 'GET',
    path: '/songs',
    handler: () => { },
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: () => { },
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: () => { },
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: () => { },
  },
];

module.exports = routes;
