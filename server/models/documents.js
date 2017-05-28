'use strict';

module.exports = (sequelize, DataTypes) => {
  const Documents = sequelize.define('Documents', {
    title: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: {
        notEmpty: true,
      } 
    },
    content: {
      type: DataTypes.TEXT,
      length: 'long',
      allowNull: false,
      validate: {
        notEmpty: true,
      } 
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false  
    },
    ownerId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
          as: 'ownerId',
        }
      }
  }, {
    classMethods: {
      associate: (models) => {
        Documents.belongsTo(models.Users, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });
      },
    }
  });
  return Documents;
};
