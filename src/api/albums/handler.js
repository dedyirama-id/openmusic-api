const autoBind = require('auto-bind');
const path = require('path');

class AlbumsHandler {
  constructor(albumsService, storageService, cacheService, validator) {
    this._albumsService = albumsService;
    this._storageService = storageService;
    this._cacheService = cacheService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);

    const { name, year } = request.payload;
    const id = await this._albumsService.addAlbum({ name, year });
    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._albumsService.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);

    const { id } = request.params;
    await this._albumsService.editAlbumById(id, request.payload);
    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._albumsService.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumCoverById(request, h) {
    const { cover } = request.payload;
    this._validator.validateImageHeaders(cover.hapi.headers);
    const { id } = request.params;
    const filename = `${id}${path.extname(cover.hapi.filename)}`;

    await this._storageService.writeFile(cover, filename);
    const newCoverUrl = `http://${process.env.HOST}:${process.env.PORT}/statics/images/${filename}`;

    await this._albumsService.updateAlbumCoverById(id, newCoverUrl);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._albumsService.getAlbumById(albumId);
    await this._albumsService.addAlbumLike(albumId, userId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });
    response.code(201);
    await this._cacheService.delete(`likes:${albumId}`);
    return response;
  }

  async deleteAlbumLikeHandler(request) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._albumsService.deleteAlbumLike(albumId, userId);
    await this._cacheService.delete(`likes:${albumId}`);
    return {
      status: 'success',
      message: 'Berhasil menghapus album dari daftar menyukai',
    };
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    try {
      const likes = JSON.parse(await this._cacheService.get(`likes:${albumId}`));
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (error) {
      const likes = await this._albumsService.getAlbumLikes(albumId);
      await this._cacheService.set(`likes:${albumId}`, JSON.stringify(likes), 60 * 30 /* 30 menit */);
      return {
        status: 'success',
        data: {
          likes,
        },
      };
    }
  }
}

module.exports = AlbumsHandler;
