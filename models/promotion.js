'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Promotion.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    discount_type: DataTypes.STRING,
    discount_value: DataTypes.NUMBER,
    min_order_amount: DataTypes.INTEGER,
    promo_code: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN,
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Promotion',
  });
  return Promotion;
};