'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Knowledge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Task }) {
      // define association here
      this.belongsTo(Task, { foreignKey: 'knowledgeId', as: 'task' });
    }

    toJSON() {
      return { ...this.get() }
    }
  }
  Knowledge.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    body: {
        type: DataTypes.STRING,
        allowNull: false,
      }
  }, {
    sequelize,
    tableName: 'knowledges',
    modelName: 'Knowledge',
  });
  return Knowledge;
};