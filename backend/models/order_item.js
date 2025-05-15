'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order_Item.belongsTo(models.Order, {foreignKey: 'order_id'})
      Order_Item.belongsTo(models.Menu_Item, {foreignKey: 'menu_item_id'})
    }
  }
  Order_Item.init({
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    menu_item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Menu_Items',
        key: 'id'
      }
    },
    quantity: DataTypes.INTEGER,
    unit_price: DataTypes.INTEGER,
    subtotal: DataTypes.INTEGER,
    special_instructions: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order_Item',
  });
  return Order_Item;
};