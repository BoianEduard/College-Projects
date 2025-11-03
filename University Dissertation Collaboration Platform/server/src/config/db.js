const mysql = require("mysql2");
const dotenv = require("dotenv");
// const { Sequelize } = require("sequelize");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 35,
  queueLimit: 0,
});

// const sequelizeDatabase = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: "mysql", // sau 'mariadb'
//     pool: {
//       max: 35,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     logging: false, // dacă nu vrei să vezi logurile SQL
//   }
// );

module.exports = pool.promise(); // folosim promise pt a putea utiliza impreuna cu async/await
// module.exports = sequelizeDatabase;
