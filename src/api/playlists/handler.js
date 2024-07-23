const autoBind = require('auto-bind');
const { mapSongDBToShortModel, mapPlaylistDBToModel, mapPlaylistActivitiesDBToModel } = require('../../utils');

class PlaylistsHandler {
  constructor(playlistsService, usersService, songsService, cacheService, validator) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._songsService = songsService;
    this._cacheService = cacheService;
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

  async getPlaylistsHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    try {
      const playlists = JSON.parse(await this._cacheService.get(`playlists:${userId}`));
      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (error) {
      const playlists = await this._playlistsService.getPlaylists(userId);
      await this._cacheService.set(`playlists:${userId}`, JSON.stringify(playlists), 60 * 30 /* 30 menit */);
      return {
        status: 'success',
        data: {
          playlists,
        },
      };
    }
  }

  async deletePlaylistByIdHandler(request) {
    const { id } = request.params;
    const { id: owner } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(id, owner);
    await this._playlistsService.deletePlaylistById(id);
    await this._cacheService.delete(`playlists:${owner}`);
    await this._cacheService.delete(`activities:${id}`);
    await this._cacheService.delete(`songs:${id}`);
    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postSongToPlaylistByIdHandler(request, h) {
    this._validator.validatePostSongsToPlaylists(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._songsService.getSongById(songId);
    await this._playlistsService.addSongToPlaylist(songId, playlistId);
    await this._playlistsService.addPlaylistActivities({
      playlistId,
      songId,
      userId,
      action: 'add',
    });
    await this._cacheService.delete(`activities:${playlistId}`);
    await this._cacheService.delete(`songs:${playlistId}`);

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getSongsInPlaylistByIdHandler(request, h) {
    const { id: playlistId } = request.params;

    await this._playlistsService.verifyPlaylistAccess(playlistId, request.auth.credentials.id);
    const playlist = await this._playlistsService.getPlaylistById(playlistId);

    try {
      const songs = JSON.parse(await this._cacheService.get(`songs:${playlistId}`));
      const response = h.response({
        status: 'success',
        data: {
          playlist: {
            ...mapPlaylistDBToModel(playlist),
            songs: songs.map(mapSongDBToShortModel),
          },
        },
      });
      response.header('X-Data-Source', 'cache');
      return response;
    } catch (error) {
      const songs = await this._playlistsService.getSongsInPlaylistById(playlistId);
      await this._cacheService.set(`songs:${playlistId}`, JSON.stringify(songs), 60 * 30 /* 30 menit */);
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
  }

  async deleteSongFromPlaylistByIdHandler(request) {
    this._validator.validateDeleteSongFromPlaylist(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: userId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
    await this._playlistsService.deleteSongFromPlaylistById(songId, playlistId);
    await this._playlistsService.addPlaylistActivities({
      playlistId,
      songId,
      userId,
      action: 'delete',
    });
    await this._cacheService.delete(`activities:${playlistId}`);
    await this._cacheService.delete(`songs:${playlistId}`);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }

  async getPlaylistActivitiesByIdHandler(request, h) {
    const { id: playlistId } = request.params;
    try {
      const activities = JSON.parse(await this._cacheService.get(`activities:${playlistId}`));
      const result = h.response({
        status: 'success',
        data: {
          playlistId,
          activities: activities.map(mapPlaylistActivitiesDBToModel),
        },
      });
      result.header('X-Data-Source', 'cache');
      return result;
    } catch (error) {
      await this._playlistsService.verifyPlaylistAccess(playlistId, request.auth.credentials.id);

      const activities = await this._playlistsService.getPlaylistActivitiesById(playlistId);
      await this._cacheService.set(`activities:${playlistId}`, JSON.stringify(activities), 60 * 30 /* 30 menit */);
      return {
        status: 'success',
        data: {
          playlistId,
          activities: activities.map(mapPlaylistActivitiesDBToModel),
        },
      };
    }
  }
}

module.exports = PlaylistsHandler;
