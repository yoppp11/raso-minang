'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const categories = require('../data/categories.json')
    console.log(categories);
    const menuItems = require('../data/menu_items.json')
    console.log(menuItems);
    const users = require('../data/users.json')

   await queryInterface.bulkInsert('Categories', categories, {})
   await queryInterface.bulkInsert('Menu_Items', menuItems, {})
   await queryInterface.bulkInsert('Users', users, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Menu_Items', null, {})
    await queryInterface.bulkDelete('Categories', null, {})
    await queryInterface.bulkDelete('Users', null, {})
  }
};
