'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('application_master', [
      { application_name: 'WISE', flag: 1 },
      { application_name: 'APPEL', flag: 1 },
      { application_name: 'iKURMA', flag: 1 },
      { application_name: 'REPORT FF', flag: 1 },
      { application_name: 'DVC', flag: 1 },
      { application_name: 'Decision Engine', flag: 1 },
      { application_name: 'CRM', flag: 1 },
      { application_name: 'SIFO', flag: 1 },
      { application_name: 'Documentum', flag: 1 },
      { application_name: 'TIMES', flag: 1 },
      { application_name: 'NOS', flag: 1 },
      { application_name: 'NOS Classsic', flag: 1 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('application_master', null, {});
  },
};
