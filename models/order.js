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
      Order.belongsTo(models.Delivery_Tracking, {foreignKey: 'order_id'})
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
    order_status: DataTypes.STRING,
    order_type: DataTypes.STRING,
    total_amount: DataTypes.INTEGER,
    delivery_address: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};