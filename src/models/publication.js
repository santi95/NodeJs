'use strict';
module.exports = (sequelize, DataTypes) => {
  const publication = sequelize.define('publication', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
        len: {
          args: [4],
          msg: 'debe tener al menos 4 caracteres',
        },
      },
    },
    logo: DataTypes.STRING,
    value: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Dale un valor a tu objeto!',
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
        len: {
          args: [20],
          msg: 'debe tener al menos 20 caracteres',
        },
      },
    },
    exchange_type: DataTypes.STRING,
    picture:  {
      type: DataTypes.STRING,
      defaultValue: "http://www.ispi-emea.org/wp-content/plugins/social-media-pro//img/no-image.png"
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open'
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

    // Dejo Link, aparece explicado muy filete
    // https://lorenstewart.me/2016/10/03/sequelize-crud-101/
    // user_id: {
    //   type: DataTypes.UUID,
      // Mas adelante tenemos que ponerle false aca
    //   allowNull: true
    // },

  }, {});
  publication.associate = function associate(models) {
    publication.belongsTo(models.category);
    publication.belongsTo(models.user);
    publication.hasMany(models.bid);
    publication.hasMany(models.comment);
  };
  return publication;
};
