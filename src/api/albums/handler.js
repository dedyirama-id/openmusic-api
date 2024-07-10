const autoBind = require("auto-bind");

class AlbumsHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  postAlbumHandler(request, h) {
    try {
      const { name, year } = request.payload;
      const id = this._service.addAlbum({ name, year });
      const response = h.response({
        status: 'success',
        message: 'Album berhasil ditambahkan',
        data: {
          albumId: id,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(400);
        return response;
      }
    }
  }

  getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = this._service.getAlbumById(id);
      return {
        status: 'success',
        data: {
          album,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);
        return response;
      }
    }
  }

  putAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.editAlbumById(id, request.payload);
      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  deleteAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this._service.deleteAlbumById(id);
      return {
        status: 'success',
        message: 'Album berhasil dihapus',
      };
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = AlbumsHandler;