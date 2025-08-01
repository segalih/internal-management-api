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

    await queryInterface.addColumn('msa', 'file_pks', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '',
      comment: 'File for PKS MSA',
    });

    await queryInterface.renameColumn('msa', 'bast', 'file_bast');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeColumn('msa', 'file_pks');
    await queryInterface.renameColumn('msa', 'file_bast', 'bast');
  },
};
