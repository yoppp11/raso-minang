'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Delivery_Tracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Delivery_Tracking.belongsTo(models.Order, {foreignKey: 'order_id'})
    }
  }
  Delivery_Tracking.init({
    order_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Oders',
        key: 'id'
      }
    },
    delivery_status: DataTypes.STRING,
    delivery_person_name: DataTypes.STRING,
    delivery_person_phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Delivery_Tracking',
  });
  return Delivery_Tracking;
};