const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "trackfilmes",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: console.log,
  }
);

module.exports = sequelize;
