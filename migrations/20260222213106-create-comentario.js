'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comentarios', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      asunto: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      usuarioId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios', // nombre exacto de la tabla en la BD
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      usuarioLigado: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Usuarios', // misma tabla referenciada
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comentarios');
  },
};