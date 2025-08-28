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
    await queryInterface.dropTable('msa_details');
    await queryInterface.dropTable('msa');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.createTable('msa', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      pks: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
      pks_file_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'documents',
          key: 'id',
        },
      },
      bast_file_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'documents',
          key: 'id',
        },
      },
    });

    // Buat ulang tabel msa_details
    await queryInterface.createTable('msa_details', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      msa_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'msa',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      rate: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      project: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      group_position: {
        type: Sequelize.STRING(255),
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
};
