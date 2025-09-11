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

    await queryInterface.bulkInsert('master_persons_in_charge', [
      { person_name: 'Cahyo Adhi Hartanto', flag: 1 },
      { person_name: 'Achmad Zain Baichuni', flag: 1 },
      { person_name: 'Rivaldo Erdany Putra', flag: 1 },
      { person_name: 'Shandy Zolla Pratama', flag: 1 },
      { person_name: 'Nadya Siti Nurbaeti', flag: 1 },
      { person_name: 'Deris Ganesha Pratama', flag: 1 },
      { person_name: 'Galih Setyawan', flag: 1 },
      { person_name: 'Rizky Dwi Ismantara', flag: 1 },
      { person_name: 'Fatan Akbar Yogenta', flag: 1 },
      { person_name: 'Dandy Fajar Pratama', flag: 1 },
      { person_name: 'Unggul Prayuda', flag: 1 },
      { person_name: 'Leonardo Robinsar Agustinus Sianturi', flag: 1 },
      { person_name: 'Dimas Widhi Prihatmadja', flag: 1 },
      { person_name: 'Dhimas Wicaksana Andrian', flag: 1 },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('master_persons_in_charge', null, {});
  },
};
