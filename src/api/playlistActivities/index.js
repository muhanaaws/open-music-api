const PlaylistActivitiesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: 'playlistActivity',
  version: '1.0.0',
  register: async (server, { playlistsService, playlistActivitiesService }) => {
    const playlistActivitiesHandler = new PlaylistActivitiesHandler(playlistsService, playlistActivitiesService);
    server.route(routes(playlistActivitiesHandler));
  }
};