'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User, Knowledge }) {
      // define association here
      // userId
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.hasMany(Knowledge, { foreignKey: 'knowledgeId', as: 'knowledges' });
    }

    toJSON() {
      return { ...this.get(), userId: undefined }
    }
  }
  Task.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taskCategory: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'tasks',
    modelName: 'Task',
  });
  return Task;
};