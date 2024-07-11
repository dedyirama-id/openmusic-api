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

module.exports = { mapSongDBToShortModel, mapSongDBToFullModel };
