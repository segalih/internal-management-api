'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hapus kolom lama
    await queryInterface.removeColumn('v2_msa', 'group_position');
    await queryInterface.removeColumn('v2_msa', 'department');
    await queryInterface.removeColumn('v2_msa', 'vendor');

    // Tambah kolom baru dengan FK
    await queryInterface.addColumn('v2_msa', 'group_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'master_groups',
        },
        key: 'id',
      },
    });

    await queryInterface.addColumn('v2_msa', 'department_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'master_departments',
      },
      key: 'id',
    });

    await queryInterface.addColumn('v2_msa', 'vendor_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'master_vendors',
      },
      key: 'id',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('v2_msa', 'group_id');
    await queryInterface.removeColumn('v2_msa', 'department_id');
    await queryInterface.removeColumn('v2_msa', 'vendor_id');

    // Tambahkan kembali kolom lama
    await queryInterface.addColumn('v2_msa', 'group_position', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('v2_msa', 'department', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('v2_msa', 'vendor', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
