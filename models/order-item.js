const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  quantity: DataTypes.INTEGER,
});

module.exports = OrderItem;
