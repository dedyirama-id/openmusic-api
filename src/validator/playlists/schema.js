const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const postSongsToPlaylistsSchema = Joi.object({
  songId: Joi.string().required(),
});

const deleteSongFromPlaylistSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  PlaylistPayloadSchema,
  postSongsToPlaylistsSchema,
  deleteSongFromPlaylistSchema,
};
