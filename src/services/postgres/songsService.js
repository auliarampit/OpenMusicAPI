/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModelSong } = require('../../utils');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, genre, performer, duration, albumId, createdAt, createdAt],
    };

    const { rows } = await this._pool.query(query);

    if (!rows[0].id) {
      throw new InvariantError('Song gagal ditambahkan');
    }

    return rows[0].id;
  }

  async getSongs(title, performer) {
    let params = '';

    if (title !== undefined && title !== '' && performer !== undefined && performer !== '') {
      params = `WHERE title ILIKE '%${title}%' AND performer '%${performer}%'`;
    }

    if (title !== undefined && title !== '') {
      params = `WHERE title ILIKE '%${title}%'`;
    }

    if (performer !== undefined && performer !== '') {
      params = `WHERE performer ILIKE '%${performer}%'`;
    }

    const { rows } = await this._pool.query(
      `SELECT  id, title, performer FROM songs ${params}`,
    );

    return rows;
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const { rows, rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Song tidak ditemukan');
    }

    return rows.map(mapDBToModelSong)[0];
  }

  async editSongById(id, {
    title, year, performer, genre, duration,
  }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Gagal memperbarui song. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('Song gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
