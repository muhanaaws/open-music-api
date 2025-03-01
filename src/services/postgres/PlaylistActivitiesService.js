const { nanoid } = require("nanoid");
const { Pool } = require("pg");

class PlaylistActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistActivity(playlistId, { songId, userId, action, time }) {
    const id = `playlistActivity-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Aktifitas gagal ditambahkan');
    }
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, pa.action, pa.time FROM playlist_activities pa
      LEFT JOIN users u ON u.id = pa.user_id
      LEFT JOIN songs s ON s.id = pa.song_id
      WHERE pa.playlist_id = $1`,
      values: [playlistId]
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistActivitiesService;