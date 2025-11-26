-- Criação do banco de dados (opcional, se ainda não existir)
-- CREATE DATABASE IF NOT EXISTS fofu;
-- USE fofu;

-- ==================================================
-- Tabela: categorias
-- ==================================================
CREATE TABLE IF NOT EXISTS `categorias` (
  `id_categoria` INTEGER NOT NULL auto_increment,
  `nome` VARCHAR(255) NOT NULL,
  -- O Sequelize adiciona automaticamente createdAt e updatedAt por padrão
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB;

-- ==================================================
-- Tabela: produto
-- ==================================================
CREATE TABLE IF NOT EXISTS `produto` (
  `id_produto` INTEGER NOT NULL auto_increment,
  `nome` VARCHAR(255),
  `preco` FLOAT,
  `descricao` VARCHAR(255),
  `imagem` VARCHAR(255) NULL,
  `id_categoria` INTEGER NULL,
  -- O Sequelize adiciona automaticamente createdAt e updatedAt por padrão
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_produto`),
  -- Definição da chave estrangeira
  FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ==================================================
-- Inserção de dados iniciais (Opcional - Para testes)
-- ==================================================

-- Inserir algumas categorias
INSERT INTO `categorias` (`nome`, `createdAt`, `updatedAt`) VALUES
('Feminino', NOW(), NOW()),
('Masculino', NOW(), NOW()),
('Infantil', NOW(), NOW());

-- Inserir alguns produtos de exemplo (assumindo os IDs de categoria acima)
-- INSERT INTO `produto` (`nome`, `preco`, `descricao`, `id_categoria`, `createdAt`, `updatedAt`) VALUES
-- ('Bolsa de Crochê Azul', 120.00, 'Bolsa artesanal feita a mão', 1, NOW(), NOW()),
-- ('Carteira de Couro', 85.50, 'Carteira masculina compacta', 2, NOW(), NOW());