'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // master_applications
    await queryInterface.createTable('master_applications', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      application_name: { type: Sequelize.STRING },
      flag: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // master_pic
    await queryInterface.createTable('master_persons_in_charge', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      person_name: { type: Sequelize.STRING },
      flag: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // master_statuses
    await queryInterface.createTable('master_statuses', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      status_name: { type: Sequelize.STRING },
      flag: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // INCIDENTS
    await queryInterface.createTable('incidents', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      ticket_number: { type: Sequelize.STRING },
      entry_date: { type: Sequelize.DATE },
      application_id: {
        type: Sequelize.INTEGER,
        references: { model: 'master_applications', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      person_in_charge_id: {
        type: Sequelize.INTEGER,
        references: { model: 'master_persons_in_charge', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      issue_code: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING },
      detail: { type: Sequelize.STRING },
      status_id: {
        type: Sequelize.INTEGER,
        references: { model: 'master_statuses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      temporary_action: { type: Sequelize.STRING, allowNull: true },
      full_action: { type: Sequelize.STRING, allowNull: true },
      root_cause_reason: { type: Sequelize.STRING, allowNull: true },
      category: { type: Sequelize.STRING, allowNull: true },
      root_cause: { type: Sequelize.STRING, allowNull: true },
      note: { type: Sequelize.STRING, allowNull: true },
      flag: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // INCIDENT_LINKS
    await queryInterface.createTable('incident_links', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      incident_id: {
        type: Sequelize.INTEGER,
        references: { model: 'incidents', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      link_url: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('incident_links');
    await queryInterface.dropTable('incidents');
    await queryInterface.dropTable('master_statuses');
    await queryInterface.dropTable('master_persons_in_charge');
    await queryInterface.dropTable('master_applications');
  },
};
