const autoBind = require("auto-bind");

class PlaylistSongsHandler {
  constructor(playlistSongsService, songsService, playlistsService, playlistActivitiesService, validator) {
    this._playlistSongsService = playlistSongsService;
    this._songsService = songsService;
    this._playlistsService = playlistsService;
    this._playlistActivitiesService = playlistActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._songsService.getSongById(songId);
    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    await this._playlistSongsService.addPlaylistSong(id, { songId });

    const action = 'add';
    const time = new Date().toISOString();

    await this._playlistActivitiesService.addPlaylistActivity(id, {
      songId,
      userId: credentialId,
      action,
      time
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);

    const playlist = await this._playlistSongsService.getPlaylistSongs(id);

    return {
      status: 'success',
      data: {
        playlist,
      }
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    const { songId } = request.payload;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistSongsService.deletePlaylistSong(id, songId);

    const action = 'delete';
    const time = new Date().toISOString();

    await this._playlistActivitiesService.addPlaylistActivity(id, {
      songId,
      userId: credentialId,
      action,
      time
    });

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist'
    };
  }
}

module.exports = PlaylistSongsHandler;