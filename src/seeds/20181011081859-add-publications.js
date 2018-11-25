'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
   
    return queryInterface.bulkInsert('publications', [
      {
        title: 'Bici Bacan',
        value: 50000,
        description: 'Intercambio mi bici por alguna wea bacan',
        exchange_type: 'exchange',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Auto malo',
        value: 500000,
        description: 'Regalo esta caga de auto que la tengo haciendo espacio',
        exchange_type: 'gift',
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Perro choro',
        value: 20000,
        description: 'Regalo a mi perrito el de ojito azule el shoro galaxia',
        exchange_type: 'gift',
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('publications', [
    {
      title: 'Bici Bacan',
      value: 50000,
      description: 'Intercambio mi bici por alguna wea bacan',
      exchange_type: 'exchange',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Auto malo',
      value: 500000,
      description: 'Regalo esta caga de auto que la tengo haciendo espacio',
      exchange_type: 'gift',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Perro choro',
      value: 20000,
      description: 'Regalo a mi perrito el de ojito azule el shoro galaxia',
      exchange_type: 'gift',
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ], {});
},
};
