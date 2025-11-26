const express = require("express");
const Categoria = require("../models/Categorias");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const Produto = require("../models/Produto");

// --- Configuração do Multer (Onde salvar as fotos) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Certifique-se que esta pasta existe na raiz
    },
    filename: (req, file, cb) => {
        // Nome do arquivo = data atual + extensão original (ex: .jpg)
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// --- ROTAS ---

// Rota para listar todas as categorias para o Dropdown
router.get("/categorias", async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar categorias" });
    }
});

router.get("/", async (req, res) => {
    const produtos = await Produto.findAll();
    res.status(200).json(produtos);
});

// POST: Adicionamos o middleware 'upload.single'
router.post("/", upload.single("file"), async (req, res) => {
    // 1. ADICIONE 'id_categoria' AQUI NA DESESTRUTURAÇÃO
    const { nome, preco, descricao, id_categoria } = req.body;
    const imagem = req.file ? req.file.filename : null;

    try {
        // 2. VERIFIQUE SE O CREATE ESTÁ USANDO A VARIÁVEL
        const novoProduto = await Produto.create({
            nome,
            preco,
            descricao,
            imagem,
            id_categoria, // <--- ESSA LINHA É FUNDAMENTAL
        });
        res.status(201).json(novoProduto);
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        res.status(500).json({ error: "Erro ao cadastrar produto" });
    }
});

router.get("/:id", async (req, res) => {
    const produto = await Produto.findByPk(req.params.id);
    res.status(200).json(produto);
});

router.delete("/:id", async (req, res) => {
    await Produto.destroy({
        where: {
            id_produto: req.params.id,
        },
    });
    res.status(200).json({ message: "Excluído com sucesso" });
});

// PUT: Também precisa do 'upload.single' caso queira trocar a foto
// Rota de Edição
router.put("/:id", upload.single("file"), async (req, res) => {
    const { nome, preco, descricao, id_categoria } = req.body;

    // --- DEBUG: VAMOS VER O QUE CHEGOU ---
    console.log("Tentando atualizar ID:", req.params.id);
    console.log("Dados Texto:", req.body);
    console.log("Arquivo Imagem:", req.file); // <--- ISSO TEM QUE APARECER NO CONSOLE
    // -------------------------------------

    let dadosParaAtualizar = { nome, preco, descricao, id_categoria };

    // Se veio uma imagem nova, adiciona ela ao objeto de atualização
    if (req.file) {
        dadosParaAtualizar.imagem = req.file.filename;
    }

    try {
        await Produto.update(dadosParaAtualizar, {
            where: { id_produto: req.params.id },
        });
        res.status(200).json({ message: "Atualizado com sucesso" });
    } catch (error) {
        console.error("Erro no SQL:", error);
        res.status(500).json({ error: "Erro ao atualizar produto" });
    }
});

module.exports = router;
