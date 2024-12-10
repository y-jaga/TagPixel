const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const searchHistory = sequelize.define("searchHistory", {
  query: DataTypes.STRING,
  userId: {
    type: DataTypes.INTEGER,
    references: { model: "users", key: "id" },
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

//One searchHistory belongs to one user
searchHistory.associate = (models) => {
  searchHistory.belongsTo(models.user, {
    foreignKey: "userId",
  });
};

module.exports = searchHistory;
