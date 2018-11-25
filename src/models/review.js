'use strict';
module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define('review', {
    score: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
      },
    },
    feedback: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
        len: {
          args: [1],
          msg: 'debe tener al menos 1 caracter',
        },
      },
    },
  }, {});
  review.associate = function associate(models) {
    review.belongsTo(models.user, { as: 'author' });
    review.belongsTo(models.user, { as: 'receiver' });
    review.hasOne(models.bid);
  };
  return review;
};
