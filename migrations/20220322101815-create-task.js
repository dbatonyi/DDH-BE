'use strict';
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      taskCategory: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      taskDescription: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('tasks');
  }
};