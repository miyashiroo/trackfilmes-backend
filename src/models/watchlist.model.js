// src/models/watchlist.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user.model");

const Watchlist = sequelize.define(
  "Watchlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    tmdbMovieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    posterPath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    watched: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    watchedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "watchlist",
    indexes: [
      {
        unique: true,
        fields: ["userId", "tmdbMovieId"],
      },
    ],
  }
);

// Definir relação com User
User.hasMany(Watchlist, { foreignKey: "userId" });
Watchlist.belongsTo(User, { foreignKey: "userId" });

module.exports = Watchlist;
