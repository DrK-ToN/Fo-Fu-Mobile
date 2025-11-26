const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 8081;

// Importação das rotas
const produto = require("./controllers/ProdutoControlls");
const categoria = require("./controllers/CategoriaControlls");

// 1. Configuração do CORS (Permite que o Front acesse o Back)
app.use(cors());

// 2. Configuração para ler JSON (Substitui o body-parser antigo)
app.use(express.json());

// 3. DEIXAR A PASTA 'UPLOADS' PÚBLICA
// O path.join garante que o servidor ache a pasta corretamente
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 4. Rota Raiz (Só para teste)
app.get("/", (req, res) => res.send("Servidor Backend Rodando perfeitamente!"));

// 5. Rotas de Produto
// Tudo que chegar em localhost:8081/produto vai para o arquivo ProdutoControlls
app.use("/categoria", categoria);
app.use("/produto", produto);

app.listen(port, () => console.log(`Servidor rodando na porta ${port}!`));
