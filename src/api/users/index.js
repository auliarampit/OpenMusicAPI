const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'User',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const albumsHandler = new UserHandler(service, validator);
    server.route(routes(albumsHandler));
  },
};
