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

    await queryInterface.addColumn('v2_msa', 'join_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('v2_msa', 'leave_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('v2_msa', 'join_date');
    await queryInterface.removeColumn('v2_msa', 'leave_date');
  },
};
