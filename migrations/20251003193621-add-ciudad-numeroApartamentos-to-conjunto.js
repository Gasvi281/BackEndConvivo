'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Conjuntos', 'ciudad', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Desconocida' // para no romper si hay registros ya
    });
    await queryInterface.addColumn('Conjuntos', 'numeroApartamentos', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Conjuntos', 'ciudad');
    await queryInterface.removeColumn('Conjuntos', 'numeroApartamentos');
  }
};
