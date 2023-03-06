const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');

const ClientError = require('./exceptions/ClientError');

const users = require('./api/users');
const albums = require('./api/albums');
const songs = require('./api/songs');

const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');

const AlbumsService = require('./services/postgres/albumsService');
const SongsService = require('./services/postgres/songsService');
const UsersService = require('./services/postgres/userService');

dotenv.config();

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }
      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: 'error',
        message: 'terjadi kegagalan pada server kami',
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
