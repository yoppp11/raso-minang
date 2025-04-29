'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu_Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Menu_Item.belongsTo(models.Category, {foreignKey: 'category_id'})
      Menu_Item.hasMany(models.Order_Item, {foreignKey: 'menu_item_id'})
      Menu_Item.hasMany(models.Cart_Item, {foreignKey: 'menu_item_id'})
      Menu_Item.hasMany(models.Review, {foreignKey: 'menu_item_id'})
    }
  }
  Menu_Item.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    is_avaible: DataTypes.BOOLEAN,
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    is_spicy: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Menu_Item',
  });
  return Menu_Item;
};