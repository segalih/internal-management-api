'use strict';

const mergeSeed = require('./utils/mergeSeed');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const persons = [
      { id: 1, person_name: 'Cahyo Adhi Hartanto', flag: 1 },
      { id: 2, person_name: 'Achmad Zain Baichuni', flag: 1 },
      { id: 3, person_name: 'Rivaldo Erdany Putra', flag: 1 },
      { id: 4, person_name: 'Shandy Zolla Pratama', flag: 1 },
      { id: 5, person_name: 'Nadya Siti Nurbaeti', flag: 1 },
      { id: 6, person_name: 'Deris Ganesha Pratama', flag: 1 },
      { id: 7, person_name: 'Galih Setyawan', flag: 1 },
      { id: 8, person_name: 'Rizky Dwi Ismantara', flag: 1 },
      { id: 9, person_name: 'Fatan Akbar Yogenta', flag: 1 },
      { id: 10, person_name: 'Dandy Fajar Pratama', flag: 1 },
      { id: 11, person_name: 'Unggul Prayuda', flag: 1 },
      { id: 12, person_name: 'Leonardo Robinsar Agustinus Sianturi', flag: 1 },
      { id: 13, person_name: 'Dimas Widhi Prihatmadja', flag: 1 },
      { id: 14, person_name: 'Dhimas Wicaksana Andrian2', flag: 1 },
    ];

    await mergeSeed(queryInterface, 'master_persons_in_charge', persons, 'id');
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
