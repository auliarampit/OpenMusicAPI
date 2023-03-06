// eslint-disable-next-line import/no-extraneous-dependencies
// const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    // autoBind(this);
  }

  async postUserHandler(request, h) {
    this.validator.validateUserPayload(request.payload);
    const { username, password, fullname } = request.payload;

    const userId = await this.service.addUser({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    });

    response.code(201);
    return response;
  }

  async getUsersHandler() {
    const user = await this.service.getUsers();
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async getUserByIdHandler(request) {
    const { id } = request.params;
    const user = await this.service.getUserById(id);
    return {
      status: 'success',
      data: {
        user,
      },
    };
  }

  async putUserByIdHandler(request) {
    this.validator.validateUserPayload(request.payload);
    const { id } = request.params;

    const user = await this.service.editUserById(id, request.payload);

    return {
      status: 'success',
      message: 'User berhasil diperbarui',
      data: {
        user: {
          id: user[0].id,
          name: request.payload.name,
          year: request.payload.year,
        },
      },
    };
  }

  async deleteUserByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteUserById(id);

    return {
      status: 'success',
      message: 'User berhasil dihapus',
    };
  }
}

module.exports = UsersHandler;
