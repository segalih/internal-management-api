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
    await queryInterface.addColumn('licenses', 'file_pks', {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.addColumn('licenses', 'file_bast', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('licenses', 'file_pks');
    await queryInterface.removeColumn('licenses', 'file_bast');
  },
};
