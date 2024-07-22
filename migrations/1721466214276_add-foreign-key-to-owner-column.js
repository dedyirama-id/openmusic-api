/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES('old_playlist', 'old_playlist', 'old_playlist', 'old playlist')");
  pgm.sql("UPDATE playlists SET owner = 'old_playlist' WHERE owner IS NULL");
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
  pgm.sql("UPDATE playlists SET owner = NULL WHERE owner = 'old_playlist'");
  pgm.sql("DELETE FROM users WHERE id = 'old_playlist'");
};
