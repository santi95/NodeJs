
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    description: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'es requerido',
        },
        len: {
          args: [10],
          msg: 'debe tener al menos 10 caracteres',
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now()
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Date.now()
    },
  }, {});
  comment.associate = function associate(models) {
    comment.belongsTo(models.user);
    comment.belongsTo(models.publication);
  };
  return comment;
};
