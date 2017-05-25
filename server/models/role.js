'use strict';

module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false 
    }
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        role.hasMany(models.User, {
          foreignKey: 'roleId',
        });
      }
    }
  });
  return role;
};