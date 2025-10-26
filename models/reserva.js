'use strict';
const { Model, DataTypes } = require('sequelize'); 

module.exports = (sequelize, DataTypes) => {
    class Reserva extends Model {
        static associate(models) {
            Reserva.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" });
            Reserva.belongsTo(models.Espacio, { foreignKey: "espacioId", as: "espacio" });
        }
    }

    Reserva.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            usuarioId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Usuario",
                    key: "id",
                },
            },
            espacioId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Espacio",
                    key: "id",
                },
            },
            fecha: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            horaInicio: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^([01]\d|2[0-3]):([0-5]\d)$/i,
                },
            },
            horaFin: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^([01]\d|2[0-3]):([0-5]\d)$/i,
                },
            },
            cantidadPersonas: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            estado: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Activo"
            },
        },
        {
            sequelize,
            modelName: "Reserva",
            tableName: "Reservas",
            timestamps: true,
        }
    );

    return Reserva;
};