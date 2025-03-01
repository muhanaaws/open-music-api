const autoBind = require("auto-bind");

class PlaylistActivitiesHandler {
  constructor(playlistService, playlistActivitiesService) {
    this._playlistsService = playlistService;
    this._playlistActivitiesService = playlistActivitiesService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    const activities = await this._playlistActivitiesService.getPlaylistActivities(id);

    return {
      status: 'success',
      data: {
        playlistId: id,
        activities
      }
    };
  }
}

module.exports = PlaylistActivitiesHandler;