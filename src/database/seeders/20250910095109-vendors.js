'use strict';

const mergeSeed = require('./utils/mergeSeed');

module.exports = {
  async up(queryInterface, Sequelize) {
    const vendors = [
      { id: 1, name: 'ADIDATA' },
      { id: 2, name: 'MITECH' },
      { id: 3, name: 'AIgen' },
    ];

    await mergeSeed(queryInterface, 'master_vendors', vendors, 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_vendors', {
      id: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
