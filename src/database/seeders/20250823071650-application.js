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
      { application_name: 'BCS', flag: 1 },
      { application_name: 'APPEL IKURMA', flag: 1 },
      { application_name: 'FCOS', flag: 1 },
      { application_name: 'MCS', flag: 1 },
      { application_name: 'NOS Cicil Emas', flag: 1 },
      { application_name: 'NOS Gadai Emas', flag: 1 },
      { application_name: 'NOS Mitraguna Online', flag: 1 },
      { application_name: 'NOS Paylater', flag: 1 },
      { application_name: 'NOS Pra Pensiun', flag: 1 },
      { application_name: 'SLA Realtime', flag: 1 },
      { application_name: 'DMS Collection', flag: 1 },
      { application_name: 'IDEB MSTT', flag: 1 },
      { application_name: 'IDEB EVOTEK ROBOTIK', flag: 1 },
      { application_name: 'JFAST', flag: 1 },
      { application_name: 'LogicalDoc', flag: 1 },
      { application_name: 'Bulk Load Processing', flag: 1 },
      { application_name: 'Scoring DPK CRG', flag: 1 },
      { application_name: 'Paylater Middleware', flag: 1 },
      { application_name: 'SIFO', flag: 1 },
      { application_name: 'Report FF', flag: 1 },
      { application_name: 'Berkah Express WISE', flag: 1 },
      { application_name: 'Qanun', flag: 1 },
      { application_name: 'Bansos', flag: 1 },
      { application_name: 'DVC', flag: 1 },
      { application_name: 'iDeb Monitoring', flag: 1 },
      { application_name: 'Decision Engine', flag: 1 },
      { application_name: 'Documentum', flag: 1 },
      { application_name: 'CRM', flag: 1 },
      { application_name: 'Salam Digital', flag: 1 },
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
