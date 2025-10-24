'use strict';
const { Model, DataTypes } = require('sequelize'); 

module.exports = (sequelize, DataTypes) => {
    class EspacioReservado extends Model {
        static associate(models) {
            EspacioReservado.belongsTo(models.Espacio, { foreignKey: "espacioId", as: "espacio" });
            EspacioReservado.belongsTo(models.Reserva, { foreignKey: "reservaId", as: "reserva" })
        }
    }

    EspacioReservado.init(
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

    return EspacioReservado;
};