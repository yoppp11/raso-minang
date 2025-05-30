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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name is required'
        },
        notNull: {
          msg: 'Name is required'
        },
        len: [1, 100]
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Description is required'
        },
        notNull: {
          msg: 'Description is required'
        },
        len: [1, 500]
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Price is required'
        },
        notNull: {
          msg: 'Price is required'
        },
        isInt: {
          msg: 'Price must be an integer'
        },
        min: {
          args: [0],
          msg: 'Price must be greater than or equal to 0'
        }
      }
    },
    image_url: DataTypes.STRING,
    is_avaible: DataTypes.BOOLEAN,
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category is required'
        },
        notNull: {
          msg: 'Category is required'
        }
      },
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