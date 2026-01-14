'use strict';
const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create super admin user
    await queryInterface.bulkInsert('Users', [{
      username: 'superadmin',
      password: hashPassword('superadmin123'),
      email: 'superadmin@rasominang.id',
      full_name: 'Super Administrator',
      phone_number: '081234567890',
      address: 'Jl. Raya Padang No. 123',
      role: 'superadmin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: 'superadmin@rasominang.id'
    }, {});
  }
};
