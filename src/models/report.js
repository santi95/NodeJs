'use strict';
module.exports = (sequelize, DataTypes) => {
  const report = sequelize.define('report', {
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
      },
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    }

  }, {});
  report.associate = function(models) {
    report.belongsTo(models.user)
  };
  return report;
};