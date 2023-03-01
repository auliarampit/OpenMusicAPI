const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Song',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const songsHandler = new SongHandler(service, validator);
    server.routes(routes(songsHandler));
  },
};
