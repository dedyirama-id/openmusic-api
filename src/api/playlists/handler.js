const autoBind = require('auto-bind');
const { mapSongDBToShortModel, mapPlaylistDBToModel } = require('../../utils');

class PlaylistsHandler {
  constructor(playlistsService, usersService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistHandler(request, h) {
    this._validator.validatePostPlaylistPayload(request.payload);
    const { name } = request.payload;
    const { id: owner } = request.auth.credentials;

    await this._usersService.getUserById(owner);
    const id = await this._playlistsService.addPlaylist({ name, owner });

    const response = h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId: id,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistsHandler(request) {
    const { id: owner } = request.auth.credentials;

    const playlists = await this._playlistsService.getPlaylists(owner);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    await this._playlistsService.verifyPlaylistOwner(id, request.auth.credentials.id);
    await this._playlistsService.deletePlaylistById(id);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistByIdHandler(request, h) {
    this._validator.validatePostSongsToPlaylists(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistOwner(playlistId, request.auth.credentials.id);
    await this._songsService.getSongById(songId);
    await this._playlistsService.addSongToPlaylist(songId, playlistId);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistByIdHandler(request) {
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, request.auth.credentials.id);

    const playlist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._playlistsService.getSongsInPlaylistById(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...mapPlaylistDBToModel(playlist),
          songs: songs.map(mapSongDBToShortModel),
        },
      },
    };
  }

  async deleteSongFromPlaylistByIdHandler(request) {
    this._validator.validateDeleteSongFromPlaylist(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    await this._playlistsService.verifyPlaylistOwner(playlistId, request.auth.credentials.id);

    await this._playlistsService.deleteSongFromPlaylistById(songId, playlistId);
    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
