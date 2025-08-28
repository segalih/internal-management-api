'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('v2_msa', 'nik', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('v2_msa', 'project');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('v2_msa', 'nik');
    await queryInterface.addColumn('v2_msa', 'project', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
