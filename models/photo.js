const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const photo = sequelize.define(
  "photo",
  {
    imageUrl: DataTypes.STRING,
    description: DataTypes.STRING,
    altDescription: DataTypes.STRING,
    tags: DataTypes.ARRAY(DataTypes.STRING),
    dateSaved: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: "user", key: "id" },
    },
  },
  { timestamps: true }
);

//Association
photo.associate = (models) => {
  // One photo belongs to a user
  photo.belongsTo(models.user, {
    foreignKey: "userId",
  });

  //One photo can belongs to many tags
  photo.hasMany(models.tag, {
    foreignKey: "photoId",
  });
};

module.exports = photo;
