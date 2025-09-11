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
    await queryInterface.addColumn('licenses', 'date_started', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('licenses', 'vendor_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'master_vendors',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('licenses', 'descriptions', {
      type: Sequelize.TEXT,
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
    await queryInterface.removeColumn('licenses', 'date_started');
    await queryInterface.removeColumn('licenses', 'vendor');
    await queryInterface.removeColumn('licenses', 'descriptions');
  },
};
