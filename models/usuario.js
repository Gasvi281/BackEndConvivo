'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class Usuario extends Model {
        static associate(models){
            Usuario.hasOne(models.Admin, { foreignKey: "id", as: "admin"})

            Usuario.hasOne(models.Vecino, { foreignKey: "id", as: "vecino"})
        }
    }

    Usuario.init(
        {
            id:{
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true,
            },
            nombreCompleto: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            correo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            rol: {
                type: DataTypes.ENUM('vecino', 'administrador'),
                allowNull: false
            }
        },

        {
            sequelize,
            modelName: "Usuario",
            tableName: "Usuarios",
            timestamps: true,

            hooks: {
                beforeCreate: async (usuario)=>{
                    const salt = await bcrypt.genSalt(10);
                    usuario.password = await bcrypt.hash(usuario.password, salt);
                }
            }
        }
    );

    return Usuario;
};