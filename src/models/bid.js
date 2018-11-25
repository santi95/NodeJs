'use strict';
module.exports = (sequelize, DataTypes) => {
  const bid = sequelize.define('bid', {
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'open',
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
  }, {});
  bid.associate = function associate(models) {
    bid.belongsTo(models.user, { as: 'receiver' });
    bid.belongsTo(models.user, { as: 'bidder' });
    bid.belongsTo(models.publication);
    bid.belongsTo(models.review);
  };
  return bid;
};
