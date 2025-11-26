const db = require("./db");
const Categorias = require("./Categorias");
const Produto = db.sequelize.define(
    "produto",
    {
        id_produto: {
            type: db.Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        nome: {
            type: db.Sequelize.STRING,
        },
        preco: {
            type: db.Sequelize.FLOAT,
        },
        descricao: {
            type: db.Sequelize.STRING,
        },
        imagem: {
            type: db.Sequelize.STRING,
            allowNull: true, // Pode ser nulo caso não tenha foto
        },
        id_categoria: {
            type: db.Sequelize.INTEGER,
            allowNull: true, // Comece como true para não quebrar produtos já existentes
            references: {
                model: "categorias", // Nome da tabela no banco
                key: "id_categoria",
            },
        },
    },
    { freezeTableName: true }
);

Produto.sync({ force: false });

// Define o relacionamento (Isso ajuda nos 'joins' futuros)
Produto.belongsTo(Categorias, { foreignKey: "id_categoria", allowNull: true });
Categorias.hasMany(Produto, { foreignKey: "id_categoria" });

module.exports = Produto;
