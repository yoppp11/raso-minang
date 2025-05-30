'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {foreignKey: 'user_id'})
      Order.hasMany(models.Order_Item, {foreignKey: 'order_id'})
      Order.hasMany(models.Delivery_Tracking, {foreignKey: 'order_id'})
    }
  }
  Order.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    order_status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    },
    order_type: {
      type: DataTypes.STRING,
      defaultValue: 'online'
    },
    total_amount: DataTypes.INTEGER,
    delivery_address: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_status: {
      type: DataTypes.STRING,
      defaultValue: 'unpaid'
    },
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};