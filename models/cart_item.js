'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart_Item.belongsTo(models.Cart, {foreignKey: 'cart_id'})
      Cart_Item.belongsTo(models.Menu_Item, {foreignKey: 'menu_item_id'})
    }
  }
  Cart_Item.init({
    cart_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Carts',
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
    special_instructions: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Cart_Item',
  });
  return Cart_Item;
};