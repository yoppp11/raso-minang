'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.User, {foreignKey: 'user_id'})
      Cart.hasMany(models.Cart_Item, {foreignKey: 'cart_id'})
    }

    static async get(){
      await Cart.findAll({
        where: {
          user_id
        },
        include: {
          attributes: {},
          model: 'Users',
          where: {
            user
          },
          include: {
          }
        }
      })
    }
  }
  Cart.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};