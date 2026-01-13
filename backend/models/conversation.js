'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    static associate(models) {
      Conversation.belongsTo(models.User, { foreignKey: 'user_id' });
      Conversation.hasMany(models.Message, { foreignKey: 'conversation_id' });
    }
  }
  Conversation.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    },
    last_message: {
      type: DataTypes.TEXT
    },
    last_message_at: {
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};
