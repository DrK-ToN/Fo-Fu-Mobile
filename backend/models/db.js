const Sequelize = require("sequelize");

const sequelize = new Sequelize("fofu", "root", "root", {
    host: "localhost",
    port: "3306",
    dialect: "mysql",
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize,
};
