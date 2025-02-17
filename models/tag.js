const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const tag = sequelize.define(
  "tag",
  {
    name: DataTypes.STRING,
    photoId: {
      type: DataTypes.INTEGER,
      references: { model: "photos", key: "id" },
    },
  },
  { timestamps: true }
);

//One tag can belongs to one photo
tag.associate = (models) => {
  tag.belongsTo(models.photo, {
    foreignKey: "photoId",
  });
};

module.exports = tag;
