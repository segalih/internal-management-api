'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // APPLICATION_MASTER
    await queryInterface.createTable('application_master', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      application_name: { type: Sequelize.STRING },
      flag: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // PERSON_IN_CHARGE_MASTER
    await queryInterface.createTable('person_in_charge_master', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      person_name: { type: Sequelize.STRING },
      flag: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deleted_at: { type: Sequelize.DATE, allowNull: true },
    });

    // STATUS_MASTER
    await queryInterface.createTable('status_master', {
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
        references: { model: 'application_master', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      person_in_charge_id: {
        type: Sequelize.INTEGER,
        references: { model: 'person_in_charge_master', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      issue_code: { type: Sequelize.STRING },
      title: { type: Sequelize.STRING },
      detail: { type: Sequelize.STRING },
      status_id: {
        type: Sequelize.INTEGER,
        references: { model: 'status_master', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      temporary_action: { type: Sequelize.STRING },
      full_action: { type: Sequelize.STRING },
      root_cause_reason: { type: Sequelize.STRING },
      category: { type: Sequelize.STRING },
      root_cause: { type: Sequelize.STRING },
      note: { type: Sequelize.STRING },
      flag: { type: Sequelize.BOOLEAN, defaultValue: true },
      update_date: { type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
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
    await queryInterface.dropTable('status_master');
    await queryInterface.dropTable('person_in_charge_master');
    await queryInterface.dropTable('application_master');
  },
};
