'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Favorite.belongsToMany(models.User, {
        through: 'favorites',
        
      })
    }
  }
  Favorite.init({
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    menu_item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Menu_Items',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Favorite',
  });
  return Favorite;
};