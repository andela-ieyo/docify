'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 8]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: 'true'
      }
    } 
  }, {
    classMethods: {
      associate: (models) => {
        user.hasMany(models.Documents, {
          foreignKey: 'userId',
          as: 'ownerID',
        });
        user.belongsTo(models.Roles, {
          foreignKey: 'roleId',
        });
      },
    }
  });
  return user;
};