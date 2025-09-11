'use strict';

const mergeSeed = require('./utils/mergeSeed');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const apps = [
      { id: 1, application_name: 'WISE', flag: 1 },
      { id: 2, application_name: 'BCS', flag: 1 },
      { id: 3, application_name: 'APPEL IKURMA', flag: 1 },
      { id: 4, application_name: 'FCOS', flag: 1 },
      { id: 5, application_name: 'MCS', flag: 1 },
      { id: 6, application_name: 'NOS Cicil Emas', flag: 1 },
      { id: 7, application_name: 'NOS Gadai Emas', flag: 1 },
      { id: 8, application_name: 'NOS Mitraguna Online', flag: 1 },
      { id: 9, application_name: 'NOS Paylater', flag: 1 },
      { id: 10, application_name: 'NOS Pra Pensiun', flag: 1 },
      { id: 11, application_name: 'SLA Realtime', flag: 1 },
      { id: 12, application_name: 'DMS Collection', flag: 1 },
      { id: 13, application_name: 'IDEB MSTT', flag: 1 },
      { id: 14, application_name: 'IDEB EVOTEK ROBOTIK', flag: 1 },
      { id: 15, application_name: 'JFAST', flag: 1 },
      { id: 16, application_name: 'LogicalDoc', flag: 1 },
      { id: 17, application_name: 'Bulk Load Processing', flag: 1 },
      { id: 18, application_name: 'Scoring DPK CRG', flag: 1 },
      { id: 19, application_name: 'Paylater Middleware', flag: 1 },
      { id: 20, application_name: 'SIFO', flag: 1 },
      { id: 21, application_name: 'Report FF', flag: 1 },
      { id: 22, application_name: 'Berkah Express WISE', flag: 1 },
      { id: 23, application_name: 'Qanun', flag: 1 },
      { id: 24, application_name: 'Bansos', flag: 1 },
      { id: 25, application_name: 'DVC', flag: 1 },
      { id: 26, application_name: 'iDeb Monitoring', flag: 1 },
      { id: 27, application_name: 'Decision Engine', flag: 1 },
      { id: 28, application_name: 'Documentum', flag: 1 },
      { id: 29, application_name: 'CRM', flag: 1 },
      { id: 30, application_name: 'Salam Digital2', flag: 1 },
    ];

    await mergeSeed(queryInterface, 'master_applications', apps, 'id');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('master_applications', {
      id: { [Sequelize.Op.between]: [1, 30] },
    });
  },
};
