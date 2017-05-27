'use strict';

import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
      isEmail: {
        msg: "Please enter a valid email address"
      }
    } 
  }, {
    hooks: {
      beforeCreate: User => {
        const salt = bcrypt.genSaltSync();
        User.password = bcrypt.hashSync(User.password, salt);
      }
    },
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Documents, {
          foreignKey: 'userId',
          as: 'ownerID',
        });
        User.belongsTo(models.Role, {
          foreignKey: 'roleId',
        });
      },
      isPassword: (encodedPassword, password) => {
        console.log({ encodedPassword, password });
        return bcrypt.compareSync(password, encodedPassword);
      }
    }
  });
  return User;
};