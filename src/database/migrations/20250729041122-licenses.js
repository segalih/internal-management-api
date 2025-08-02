'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('licenses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pks: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pks_file_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      bast_file_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      application: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      due_date_license: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      health_check_routine: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      health_check_actual: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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
    await queryInterface.dropTable('licenses');
  },
};
