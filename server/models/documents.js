module.exports = (sequelize, DataTypes) => {
  const Documents = sequelize.define('Documents', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'The title field cannot be empty'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      length: 'long',
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The content field cannot be empty'
        }
      }
    },
    access: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['public', 'private', 'editor', 'writer']],
          msg: 'Must be either public, private, writer or editor'
        }
      }
    },
    ownerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        as: 'ownerId'
      }
    }
  }, {
    classMethods: {
      associate: (models) => {
        Documents.belongsTo(models.Users, {
          foreignKey: 'ownerId'
        });
      }
    }
  });
  return Documents;
};
