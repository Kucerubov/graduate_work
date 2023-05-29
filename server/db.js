const {Sequelize} = require('sequelize');
const DB_NAME = '***';
const DB_USER ='***';
const DB_PASSWORD ='***';
const DB_HOST = '***';
const DB_PORT = '***'

module.exports = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        dialect: 'postgres',
        host: DB_HOST,
        port: DB_PORT
    }
)
