const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async likeAlbum(userId, albumId) {
    const id = `user-album-like-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id`,
      values: [id, userId, albumId]
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Like gagal ditambahkan');
    }

    await this._cacheService.delete(`album-like:${albumId}`);
    return result.rows[0].id;
  }

  async deleteLikeAlbum(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Like gagal dihapus. Id tidak ditemukan');
    }

    await this._cacheService.delete(`album-like:${albumId}`);
  }

  async getAlbumById(albumId) {
    try {
      const result = await this._cacheService.get(`album-like:${albumId}`);
      return {
        isCache: true,
        likes: JSON.parse(result),
      };
    } catch (error) {
      const query = {
        text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(`album-like:${albumId}`, JSON.stringify(result.rowCount));

      return {
        isCache: false,
        likes: result.rowCount,
      };
    }
  }

  async verifyAlbumLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);
    if (result.rowCount) {
      throw new InvariantError('Tidak bisa memberikan like pada album yang sama ');
    }
  }
}

module.exports = UserAlbumLikesService;