/* eslint-disable camelcase */
const mapSongDBToShortModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

const mapSongDBToFullModel = ({
  id, title, year, performer, genre, duration, album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapPlaylistDBToModel = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = { mapSongDBToShortModel, mapSongDBToFullModel, mapPlaylistDBToModel };
