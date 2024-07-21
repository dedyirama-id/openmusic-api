const InvariantError = require('../../exceptions/InvariantError');
const { PlaylistPayloadSchema, postSongsToPlaylistsSchema } = require('./schema');

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostSongsToPlaylists: (payload) => {
    const validationResult = postSongsToPlaylistsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteSongFromPlaylist: (payload) => {
    const validationResult = postSongsToPlaylistsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
