module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Messages', {
          id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.literal('gen_random_uuid()'),
              primaryKey: true,
              allowNull: false,
          },
          sender_id: {
              type: Sequelize.UUID,
              allowNull: false,
          },
          receiver_id: {
              type: Sequelize.UUID,
              allowNull: false,
          },
          content: {
              type: Sequelize.TEXT,
              allowNull: false,
          },
          createdAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          updatedAt: {
              type: Sequelize.DATE,
              allowNull: false,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Messages');
  },
};
