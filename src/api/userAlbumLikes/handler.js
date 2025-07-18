const autoBind = require("auto-bind");

class UserAlbumLikesHandler {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikeService = userAlbumLikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postUserAlbumLikesHandler(request, h) {
    const { id: userId } = request.auth.credentials;
    const { id: albumId } = request.params;

    await this._albumsService.verifyExistAlbum(albumId);
    await this._userAlbumLikeService.verifyAlbumLike(userId, albumId);
    await this._userAlbumLikeService.likeAlbum(userId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Like berhasil ditambahkan',
    });
    response.code(201);
    return response;
  }

  async deleteUserAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: userId } = request.auth.credentials;
    await this._userAlbumLikeService.deleteLikeAlbum(userId, albumId);

    return {
      status: 'success',
      message: 'Like berhasil dihapus',
    };
  }

  async getUserAlbumLikesHandler(request, h) {
    const { id } = request.params;
    await this._albumsService.getAlbumById(id);

    const { likes, isCache } = await this._userAlbumLikeService.getAlbumById(id);

    const response = h.response({
      status: 'success',
      data: {
        likes,
      },
    });

    if (isCache) {
      response.header('X-Data-Source', 'cache');
    } else {
      response.header('X-Data-Source', 'not-cache');
    }

    response.code(200);
    return response;
  }
}

module.exports = UserAlbumLikesHandler;