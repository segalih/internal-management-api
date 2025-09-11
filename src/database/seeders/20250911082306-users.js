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
      },
    ];

    await mergeSeed(queryInterface, 'users', users, 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
