'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert('person_in_charge_master', [
      { person_name: 'Cahyo Adhi Hartanto', flag: 1 },
      { person_name: 'Achmad Zain Baichuni', flag: 1 },
      { person_name: 'Rivaldo', flag: 1 },
      { person_name: 'Shandy Zolla Pratama', flag: 1 },
      { person_name: 'Nadya Siti Nurbaeti', flag: 1 },
      { person_name: 'Deris Ganesha Pratama', flag: 1 },
      { person_name: 'Galih Setyawan', flag: 1 },
      { person_name: 'Rizky Dwi Ismantara', flag: 1 },
      { person_name: 'Fatan Akbar Yogenta', flag: 1 },
      { person_name: 'Dandy Fajar Pratama', flag: 1 },
      { person_name: 'Unggul', flag: 1 },
      { person_name: 'Leo', flag: 1 },
      { person_name: 'Dimas Widhi', flag: 1 },
      { person_name: 'Dhimas Wicak', flag: 1 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('person_in_charge_master', null, {});
  },
};
