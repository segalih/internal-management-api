'use strict';

const mergeSeed = require('./utils/mergeSeed');

module.exports = {
  async up(queryInterface, Sequelize) {
    const vendors = [
      { id: 1, name: 'MSI' },
      { id: 2, name: 'BERCA' },
      { id: 3, name: 'DLL' },
    ];

    await mergeSeed(queryInterface, 'master_vendor_applications', vendors, 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_vendor_applications', {
      id: { [Sequelize.Op.in]: [1, 2, 3] },
    });
  },
};
