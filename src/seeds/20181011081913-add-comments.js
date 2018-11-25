'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('comments', [{
      id: 1,
      description: "Primer Comentario",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      publicationId: 1
    },
    {
      id: 2,
      description: "Lorem ipsum dolor sit liqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 2,
      publicationId: 1
    },
  ], {});

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

   return queryInterface.bulkDelete('comments', [{
    id: 1,
    description: "Primer Comentario",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
    publicationId: 1
  },
  {
    id: 2,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1,
    publicationId: 1
  },
], {});
  }
};
