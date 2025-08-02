'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('msa_details', 'rate', {
      type: Sequelize.STRING,
      allowNull: true, // ubah jika kolom ini wajib diisi
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('msa_details', 'rate', {
      type: Sequelize.INTEGER,
      allowNull: true, // sesuaikan dengan kondisi sebelumnya
    });
  },
};
