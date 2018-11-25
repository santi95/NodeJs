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
    return queryInterface.bulkInsert('categories', [
      {
        name: 'Autos, Motos y Otros',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Inmuebles',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Servicios',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Animales',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Cámaras y Accesorios',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Celulares',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Coleccionables',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Deportes',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Electrodomésticos',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Herramientas y construcción',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Juegos y juguetes',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Partes de Bicicleta',
        createdAt: new Date(), 
        updatedAt: new Date(),
      },
      {
        name: 'Otros',
        createdAt: new Date(), 
        updatedAt: new Date(),
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
   return queryInterface.bulkDelete('categories', [
    {
      name: 'Autos, Motos y Otros',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Inmuebles',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Servicios',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Animales',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Cámaras y Accesorios',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Celulares',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Coleccionables',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Deportes',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Electrodomésticos',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Herramientas y construcción',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Juegos y juguetes',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Partes de Bicicleta',
      createdAt: new Date(), 
      updatedAt: new Date(),
    },
    {
      name: 'Otros',
      createdAt: new Date(), 
      updatedAt: new Date(),
    }], {});
},

};
