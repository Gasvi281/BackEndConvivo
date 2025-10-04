'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vecinos', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Usuarios',
          key: 'id'
        },
      },
      conjuntoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Conjuntos',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      numeroApartamento: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Vecinos');
  }
};
