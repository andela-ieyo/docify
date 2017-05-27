'use strict';

module.exports = (sequelize, DataTypes) => {
  const documents = sequelize.define('Documents', {
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
    } 
  }, {
    classMethods: {
      associate: (models) => {
        documents.belongsTo(models.User, {
          foreignKey: 'userId',
          onDelete: 'CASCADE',
        });

      },
    }
  });
  return documents;
};
