import bcrypt from 'bcrypt-nodejs';

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The firstName field cannot be empty'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The lastName field cannot be empty'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'The username field cannot be empty'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          min: 6,
          msg: 'Must be greater than 5 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        isEmail: {
          msg: 'Please enter a valid email address'
        }
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
        Users.hasMany(models.Documents, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
          hooks: true
        });
        Users.belongsTo(models.Roles, {
          foreignKey: 'roleId'
        });
      },
      isPassword: (encodedPassword, password) => {
        return bcrypt.compareSync(password, encodedPassword);
      }
    }
  });
  return Users;
};
