const InvariantError = require("../../exceptions/InvariantError");
const { PlaylistSongPayloadSchema } = require("./schema");

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validateResult = PlaylistSongPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  }
};

module.exports = PlaylistSongsValidator;