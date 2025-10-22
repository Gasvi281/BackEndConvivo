'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Conjunto extends Model{
        static associate(models){
            Conjunto.hasOne(models.Admin, {foreignKey: "conjuntoId", as: "admin"})

            Conjunto.hasMany(models.Vecino, {foreignKey: "conjuntoId", as: "vecinos"})

            Conjunto.hasMany(models.Espacio, {foreignKey: "conjuntoId", as: "espacios"})
        }
    }

    Conjunto.init(
        {
            id:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            nombreConjunto:{
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            direccion:{
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            ciudad: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            numeroApartamentos: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }

        },

        {
            sequelize,
            modelName: "Conjunto",
            tableName: "Conjuntos",
            timestamps: true
        }
    )

    return Conjunto;

};