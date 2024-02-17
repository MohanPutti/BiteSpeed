import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'bspeed',
  password: 'bspeed123$',
  database: 'bitespeed',
  define: {
    freezeTableName: true,
    timestamps: false,
  }
});

export default sequelize;