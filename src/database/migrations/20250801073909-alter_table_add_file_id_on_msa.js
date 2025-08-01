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
    await queryInterface.addColumn('msa', 'pks_file_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'documents',
        },
        key: 'id',
      },
    });
    await queryInterface.addColumn('msa', 'bast_file_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'documents',
        },
        key: 'id',
      },
    });
    await queryInterface.removeColumn('msa', 'file_pks');
    await queryInterface.removeColumn('msa', 'file_bast');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('msa', 'pks_file_id');
    await queryInterface.removeColumn('msa', 'bast_file_id');
    await queryInterface.addColumn('msa', 'file_pks', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      comment: 'File for PKS MSA',
    });
    await queryInterface.addColumn('msa', 'file_bast', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      comment: 'File for BAST MSA',
    });
  },
};
