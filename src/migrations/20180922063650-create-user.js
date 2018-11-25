'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'
      },
      location: {
          type: Sequelize.STRING,
          required: true
      },
      password: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      reputation: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
      picture:  {
        type: Sequelize.STRING,
        defaultValue: "https://virtual-strategy.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
