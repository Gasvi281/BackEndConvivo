'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Espacios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
        allowNull: false,
        primaryKey: true,
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      conjuntoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Conjuntos',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      horaInicio: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      horaFin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      diasHabilitados: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      estadoEspacio: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Activo',
      },
      cantidadPersonas: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tiempoMaximo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Espacios');
  },
};
