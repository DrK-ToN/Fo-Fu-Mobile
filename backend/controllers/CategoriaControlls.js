const express = require("express");
const router = express.Router();
const Categoria = require("../models/Categorias");
const Produto = require("../models/Produto");

// 1. LISTAR TODAS AS CATEGORIAS COM SEUS PRODUTOS
router.get("/", async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            // O SEGREDO ESTÁ AQUI: Include traz os dados relacionados
            include: [
                {
                    model: Produto,
                    required: false, // false = Traz a categoria mesmo se não tiver produtos nela (LEFT JOIN)
                },
            ],
            order: [
                ["nome", "ASC"], // Ordena as categorias por nome (A-Z)
                [Produto, "nome", "ASC"], // Ordena os produtos dentro da categoria por nome (A-Z)
            ],
        });
        res.status(200).json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Erro ao buscar categorias com produtos",
        });
    }
});

// 2. CADASTRAR
router.post("/", async (req, res) => {
    const { nome } = req.body;
    try {
        await Categoria.create({ nome });
        res.status(200).json({ message: "Categoria criada!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao criar categoria" });
    }
});

// 3. ATUALIZAR
router.put("/:id", async (req, res) => {
    const { nome } = req.body;
    try {
        await Categoria.update(
            { nome },
            { where: { id_categoria: req.params.id } }
        );
        res.status(200).json({ message: "Categoria atualizada!" });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar" });
    }
});

// 4. DELETAR
router.delete("/:id", async (req, res) => {
    const idCategoria = req.params.id;

    try {
        const produtosVinculados = await Produto.count({
            where: { id_categoria: idCategoria },
        });
        if (produtosVinculados > 0) {
            return res.status(400).json({
                error: "Esta categoria não pode ser excluída pois possui produtos cadastrados.",
            });
        }
        const linhasApagadas = await Categoria.destroy({
            where: { id_categoria: idCategoria },
        });

        if (linhasApagadas > 0) {
            res.status(200).json({
                message: "Categoria excluída com sucesso!",
            });
        } else {
            res.status(404).json({ error: "Categoria não encontrada." });
        }
    } catch (err) {
        console.error("Erro ao excluir categoria:", err);
        // Se der algum outro erro de banco de dados
        res.status(500).json({
            error: "Erro interno ao tentar excluir a categoria.",
        });
    }
});

module.exports = router;
