const InvariantError = require('../../exceptions/InvariantError');
const { SongPayloadSchema } = require('./schema');

const SongValidator = {
  validateSongPayload: (payload) => {
    const validatorResult = SongPayloadSchema.validate(payload);
    if (validatorResult.error) {
      throw new InvariantError(validatorResult.error.message);
    }
  },
};

module.exports = SongValidator;
