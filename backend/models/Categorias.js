const db = require("./db");
const Categoria = db.sequelize.define(
    "categorias",
    {
        id_categoria: {
            type: db.Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nome: {
            type: db.Sequelize.STRING,
            allowNull: false,
        },
    },
    { freezeTableName: true }
);

Categoria.sync({ force: false });

module.exports = Categoria;
