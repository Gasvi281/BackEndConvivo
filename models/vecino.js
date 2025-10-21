'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Vecino extends Model {
        static associate(models) {
            Vecino.belongsTo(models.Usuario, { foreignKey: "id", as: "usuario" });

            Vecino.belongsTo(models.Conjunto, { foreignKey: "conjuntoId", as: "conjunto" });
        }
    }

    Vecino.init(
        {
            id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                references: {
                    model: "Usuario",
                    key: "id",
                },
            },
            conjuntoId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Conjunto",
                    key: "id",
                },
            },
            numeroApartamento: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false
            },
            telefono: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "Vecino",
            tableName: "Vecinos",
            timestamps: true,
        }
    );

    return Vecino;
};