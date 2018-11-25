'use strict'

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    // id: {
    //   type: DataTypes.UUID,
    //   primaryKey: true,
    //   defaultValue: DataTypes.UUIDV4
    // },
    firstName: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
        len: {
          args: [2],
          msg: 'debe tener al menos 2 caracteres',
        },
},
    },
    lastName: {
      type: DataTypes.STRING,
      required: true,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
        len: {
          args: [2],
          msg: 'debe tener al menos 2 caracteres',
        },
},
    },
    role: {
      type: DataTypes.ENUM,
      values: ['user', 'admin'],
      defaultValue: 'user'
    },
    location: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          notEmpty: {
            msg: 'es requerido',
          },
          len: {
            args: [2],
            msg: 'debe tener al menos 2 caracteres',
          },
  },
    },
    password: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          notEmpty: {
            msg: 'es requerido',
          },
          len: {
            args: [6],
            msg: 'debe tener al menos 7 caracteres',
          },
          securePassword(value) {
            if (!/[a-z]/.test(value)) throw new Error('Debe tener al menos una minúscula');
            if (!/[A-Z]/.test(value)) throw new Error('Debe tener al menos una mayúscula');
            if (!/[0-9]/.test(value)) throw new Error('Debe tener al menos un número');
          },
  },
    },
    email: {
        type: DataTypes.STRING,
        required: true,
        validate: {
          notEmpty: {
            msg: 'es requerido',
          },
          isEmail: {
            msg: 'debe tener formato de e-mail',
          },
  },
    },
    reputation: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    picture:  {
      type: DataTypes.STRING,
      defaultValue: "https://virtual-strategy.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now(),
    },
    deletedAt: DataTypes.DATE,
  }, {});

  user.associate = function associate(models) {
    user.hasMany(models.publication);
    user.hasMany(models.report);
  };

  return user;
};
