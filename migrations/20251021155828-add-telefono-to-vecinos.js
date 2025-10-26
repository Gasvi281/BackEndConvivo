'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Vecinos', 'telefono', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0000000000'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Vecinos', 'telefono');
  },
};
