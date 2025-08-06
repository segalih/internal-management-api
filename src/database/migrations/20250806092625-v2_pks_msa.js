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

    await queryInterface.createTable('v2_pks_msa', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pks: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_pks: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      file_bast: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_started: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      date_ended: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      people_quota: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      budget_quota: {
        type: Sequelize.DECIMAL(14, 2),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('v2_pks_msa');
  },
};
