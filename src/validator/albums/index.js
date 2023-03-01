const InvariantError = require('../../exceptions/InvariantError');
const { AlbumPayloadSchema } = require('./schema');

const AlbumValidator = {
  validateAlbumPayload: (payload) => {
    const validatorResult = AlbumPayloadSchema.validate(payload);
    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },
};

module.exports = AlbumValidator;
