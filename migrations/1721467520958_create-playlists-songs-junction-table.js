/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable('playlists_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  pgm.addConstraint('playlists_songs', 'unique_playlists_id_and_songs_id', 'UNIQUE(playlist_id, song_id)');

  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.playlist_id_playlists.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.song_id_songs.id');
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.playlist_id_playlists.id');
  pgm.dropConstraint('playlists_songs', 'unique_playlists_id_and_songs_id');
  pgm.dropTable('playlists_songs');
};
