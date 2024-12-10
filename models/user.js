const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const user = sequelize.define("user", {
  username: DataTypes.STRING,
  email: DataTypes.STRING,
});

//Associations
user.associate = (models) => {
  // One user can have many photos
  user.hasMany(models.photo, {
    foreignKey: "userId",
  });

  //One user can have many search history
  user.hasMany(models.searchHistory, {
    foreignKey: "userId",
  });
};

module.exports = user;
