'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); 

module.exports = (sequelize, DataTypes) => {
    class Espacio extends Model {
        static associate(models) {
            Espacio.belongsTo(models.Conjunto, { foreignKey: "conjuntoId", as: "conjunto" });
        }
    }

    Espacio.init( //Nombre, hora inicio, hora fin, dias habilitados, estado del espacio, cantidad de personas, tiempo maximo
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            nombre: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            descripcion: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            conjuntoId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Conjunto",
                    key: "id",
                },
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
            diasHabilitado: {
                type: DataTypes.JSON,
                allowNull: false,
            },
            estadoEspacio: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "Activo"
            },
            cantidadPersonas: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            tiempoMaximo: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: "Espacio",
            tableName: "Espacios",
            timestamps: true,
        }
    );

    return Espacio;
};