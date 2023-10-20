import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import moment from "moment-timezone";
config();

//==================================================================================================
// Configuración de la conexión a la base de datos
//==================================================================================================
const db = {
  host: process.env.MYSQLDB_HOST,
  user: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_PASSWORD,
  database: process.env.MYSQLDB_NAME,
  port: process.env.MYSQLDB_PORT_DOCKER,
};

export { moment, mysql, bcrypt, db };