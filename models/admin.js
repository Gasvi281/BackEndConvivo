'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        static associate(models) {
            Admin.belongsTo(models.Usuario, { foreignKey: "id", as: "usuario" });

            Admin.belongsTo(models.Conjunto, { foreignKey: "conjuntoId", as: "conjunto" });
        }
    }

    Admin.init(
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
            telefono: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "Admin",
            tableName: "Admins",
            timestamps: true,
        }
    );

    return Admin;
};