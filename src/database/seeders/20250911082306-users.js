'use strict';

const mergeSeed = require('./utils/mergeSeed');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [
      {
        id: 1,
        name: 'Admin',
        role: 'superadmin',
        email: 'admin@admin.admin',
        password: '$2b$10$qIBspgo80TNIM/oVmsYbSu0hM8Gy2z./bapjHIamsRO6hDObcsyKi',
        created_at: '2025-09-11T01:24:02.271Z',
        updated_at: '2025-09-11T01:24:02.271Z',
        deleted_at: null,
      },
    ];

    await mergeSeed(queryInterface, 'users', users, 'id');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
