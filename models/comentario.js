'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comentario extends Model{
        static associate(models){
            Comentario.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" });
            Comentario.belongsTo(models.Usuario, { foreignKey: "usuarioLigado", as: "ligado" });
        }
    }

    Comentario.init(
        {
            id:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            descripcion:{
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            asunto: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            usuarioId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Usuario",
                    key: "id",
                },
            },
            usuarioLigado: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "Usuario",
                    key: "id",
                },
            },

        },

        {
            sequelize,
            modelName: "Comentario",
            tableName: "Comentarios",
            timestamps: true
        }
    )

    return Comentario;

};