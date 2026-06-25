use erp2;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `paises`;
CREATE TABLE `paises` (
  `codPais` int(11) NOT NULL AUTO_INCREMENT,
  `pais` varchar(100) DEFAULT NULL,
  `sigla` char(3) DEFAULT NULL,
  `ddi` varchar(5) DEFAULT NULL,
  `moeda` varchar(50) DEFAULT NULL,
  `codUsuario` int(11) not null,
  `criado_em` datetime DEFAULT current_timestamp(),
  `atualizado_em` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codPais`),
  foreign key (codUsuario) references usuarios(codUsuario)
);

DROP TABLE IF EXISTS `estados`;
CREATE TABLE `estados` (
  `codEstado` int(11) NOT NULL AUTO_INCREMENT,
  `UF` char(2) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `codPais` int(11) DEFAULT NULL,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codEstado`),
  KEY `codPais` (`codPais`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `estados_ibfk_1` FOREIGN KEY (`codPais`) REFERENCES `paises` (`codPais`),
  CONSTRAINT `estados_ibfk_2` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);

drop table if exists cidades;
CREATE TABLE `cidades` (
  `codCidade` int(11) NOT NULL AUTO_INCREMENT,
  `cidade` varchar(100) DEFAULT NULL,
  `codEstado` int(11) DEFAULT NULL,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codCidade`),
  KEY `codEstado` (`codEstado`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `cidades_ibfk_1` FOREIGN KEY (`codEstado`) REFERENCES `estados` (`codEstado`),
  CONSTRAINT `cidades_ibfk_2` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);

DROP TABLE IF EXISTS `condicoes_pagamento`;
CREATE TABLE `condicoes_pagamento` (
  `codCondPagamento` int(11) NOT NULL AUTO_INCREMENT,
  `condPagamento` varchar(50) NOT NULL,
  `qtdParcelas` int(11) NOT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `juros` decimal(10.2) not null,
  `multa` decimal(10.2) not null,
  `desconto` decimal(10.2) not null,
   `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codCondPagamento`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `condicoes_pagamento_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);
DROP TABLE IF EXISTS `condicoes_pagamentos_parcelas`;
CREATE TABLE `condicoes_pagamentos_parcelas` (
  `codCondPagamento` int(11) NOT NULL,
  `numeroParcela` int(11) NOT NULL,
  `diasVencimento` int(11) NOT NULL,
  `codFormaPagamento` int(11) NOT NULL, 
  `percentual` decimal(5,2) DEFAULT 100.00,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY `codCondPagamento` (`codCondPagamento`,`numeroParcela`),
  KEY `codFormaPagamento` (`codFormaPagamento`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `condicoes_pagamentos_parcelas_ibfk_1` FOREIGN KEY (`codCondPagamento`) REFERENCES `condicoes_pagamento` (`codCondPagamento`),
  CONSTRAINT `condicoes_pagamentos_parcelas_ibfk_2` FOREIGN KEY (`codFormaPagamento`) REFERENCES `formas_pagamento` (`codFormaPagamento`),
  CONSTRAINT `condicoes_pagamentos_parcelas_ibfk_3` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)

);


DROP TABLE IF EXISTS `formas_pagamento`;
CREATE TABLE `formas_pagamento` (
  `codFormaPagamento` int(11) NOT NULL AUTO_INCREMENT,
  `formaPagamento` varchar(50) NOT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codFormaPagamento`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `formas_pagamento_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);

DROP TABLE IF EXISTS `fornecedores`;
CREATE TABLE `fornecedores` (
  `codForn` int(11) NOT NULL AUTO_INCREMENT,
  `fornecedor` varchar(50) DEFAULT NULL,
  `apelido_NomeFantasia` varchar(50) DEFAULT NULL,
  `ender` varchar(50) DEFAULT NULL,
  `numero` varchar(4) DEFAULT NULL,
  `complemento` varchar(20) DEFAULT NULL,
  `bairro` varchar(30) DEFAULT NULL,
  `codCidade` int(11) DEFAULT NULL,
  `cep` varchar(8) DEFAULT NULL,
  `site` varchar(50) DEFAULT NULL,
  `fone` varchar(20) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `codCondPagamento` int(11) DEFAULT NULL,
  `limiteCredito` decimal(10,2) not null,
  `rg_inscEst` varchar(10) DEFAULT NULL,
  `tipoPessoa` varchar(1) DEFAULT NULL,
  `cpf_cnpj` varchar(14) DEFAULT NULL,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codForn`),
  KEY `codCidade` (`codCidade`),
  KEY `codUsuario` (`codUsuario`),
  KEY `codCondPagamento` (`codCondPagamento`),
  CONSTRAINT `fornecedores_ibfk_1` FOREIGN KEY (`codCidade`) REFERENCES `cidades` (`codCidade`),
  CONSTRAINT `fornecedores_ibfk_2` FOREIGN KEY (`codCondPagamento`) REFERENCES `condicoes_pagamento`(`codCondPagamento`),
  CONSTRAINT `fornecedores_ibfk_3` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);


DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `codLog` int(11) NOT NULL AUTO_INCREMENT,
  `codUsuario` int(11) NOT NULL,
  `nomeTabela` varchar(15) not null,
  `codRegistro` int(11) not null,
  `novoRegistro` int(11) not null,
  `tipo` varchar(50) NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`codLog`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);

DROP TABLE IF EXISTS `ncm_sh`;


DROP TABLE IF EXISTS `nfe`;
CREATE TABLE `nfe` (
  `numNfe` int(11) NOT NULL,
  `serie` int(11) NOT NULL,
  `modelo` int(11) NOT NULL,
  `codForn` int(11) NOT NULL,
  `pagina` int(11) DEFAULT NULL,
  `natOper` varchar(20) DEFAULT NULL,
  `protAcesso` varchar(100) DEFAULT NULL,
  `dataProtAcesso` date DEFAULT NULL,
  `horaProtAcesso` time DEFAULT NULL,
  `chaveAcessoNFe` varchar(100) DEFAULT NULL,
  `dataEmitNfe` date DEFAULT NULL,
  `dataEntNfe` date DEFAULT NULL,
  `horaEntNFe` time DEFAULT NULL,
  `baseCalcIcms` decimal(10,2) DEFAULT NULL,
  `valorIcms` decimal(10,2) DEFAULT NULL,
  `baseCalcIcmsSub` decimal(10,2) DEFAULT NULL,
  `valorIcmsSub` decimal(10,2) DEFAULT NULL,
  `valorFreteNFe` decimal(10,2) DEFAULT NULL,
  `valorSeguroNFe` decimal(10,2) DEFAULT NULL,
  `descontoNFe` decimal(10,2) DEFAULT NULL,
  `outrasDespNfe` decimal(10,2) DEFAULT NULL,
  `valorIpi` decimal(10,2) DEFAULT NULL,
  `codTransp` int(11) DEFAULT NULL,
  `fretePorContaNFe` int(11) DEFAULT NULL,
  `codVeic` int(11) DEFAULT NULL,
  `qtdadeVol` int(11) DEFAULT NULL,
  `especieVol` varchar(50) DEFAULT NULL,
  `marcaVol` varchar(50) DEFAULT NULL,
  `pesoBrutoVol` decimal(10,2) DEFAULT NULL,
  `pesoLiqVol` decimal(10,2) DEFAULT NULL,
  `infComp` text DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `codFormaPagamento` int(11) DEFAULT NULL,
  `codCondPagamento` int(11) DEFAULT NULL,
  PRIMARY KEY (`numNfe`,`serie`,`modelo`,`codForn`),
  KEY `codForn` (`codForn`),
  KEY `codTransp` (`codTransp`),
  KEY `codVeic` (`codVeic`),
  KEY `fk_nfe_formapagamento` (`codFormaPagamento`),
  KEY `fk_nfe_condpagamento` (`codCondPagamento`),
  CONSTRAINT `fk_nfe_condpagamento` FOREIGN KEY (`codCondPagamento`) REFERENCES `condicoes_pagamento` (`codCondPagamento`),
  CONSTRAINT `fk_nfe_formapagamento` FOREIGN KEY (`codFormaPagamento`) REFERENCES `formas_pagamento` (`codFormaPagamento`),
  CONSTRAINT `nfe_ibfk_1` FOREIGN KEY (`codForn`) REFERENCES `fornecedores` (`codForn`),
  CONSTRAINT `nfe_ibfk_2` FOREIGN KEY (`codTransp`) REFERENCES `transportadores` (`codTransp`),
  CONSTRAINT `nfe_ibfk_3` FOREIGN KEY (`codVeic`) REFERENCES `veiculo` (`codVeic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `prod_nfe`;
CREATE TABLE `prod_nfe` (
  `numNfe` int(11) NOT NULL,
  `serie` int(11) NOT NULL,
  `modelo` int(11) NOT NULL,
  `codProd` int(11) NOT NULL,
  `CSOSNProdNFe` varchar(10) DEFAULT NULL,
  `CFOPProdNFe` varchar(10) DEFAULT NULL,
  `qtdProdNFe` decimal(10,2) DEFAULT NULL,
  `vlrUntProdNFe` decimal(10,2) DEFAULT NULL,
  `vlrDescProdNFe` decimal(10,2) DEFAULT NULL,
  `vlrIcmsProdNFe` decimal(10,2) DEFAULT NULL,
  `vlrIPIProdNfe` decimal(10,2) DEFAULT NULL,
  `aliqIcmsProdNFe` decimal(10,2) DEFAULT NULL,
  `aliqIpiProdNFe` decimal(10,2) DEFAULT NULL,
  `baseCalcIcmsProd` decimal(10,2) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`numNfe`,`serie`,`modelo`,`codProd`),
  KEY `codProd` (`codProd`),
  CONSTRAINT `prod_nfe_ibfk_1` FOREIGN KEY (`numNfe`, `serie`, `modelo`) REFERENCES `nfe` (`numNfe`, `serie`, `modelo`),
  CONSTRAINT `prod_nfe_ibfk_2` FOREIGN KEY (`codProd`) REFERENCES `produtos` (`codProd`)
);

DROP TABLE IF EXISTS `produtos`;
CREATE TABLE `produtos` (
  `codProd` int(11) NOT NULL auto_increment,
  `produto` varchar(35) DEFAULT NULL,
  `codMarca` int(11) not null,
  `codGrupo` int(11) not null,
  `codUnidade` int(11) not null,
  `codigoBarras` varchar(13) not null unique,
  `undProd` varchar(3) DEFAULT NULL,
  `pesoBruto` decimal(10,2) DEFAULT NULL,
  `pesoLiq` decimal(10,2) DEFAULT NULL,
  `saldoProd` decimal(10,2) DEFAULT NULL,
  `precoVenda` decimal(10,2) NOT NULL,
  `precoCompra` decimal(10,2) NOT NULL,
  `custoMedioProd` decimal(10,2) DEFAULT NULL,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codProd`),
  KEY `codUsuario` (`codUsuario`),
  KEY `codGrupo` (`codGrupo`),
  KEY `codMarca` (`codMarca`),
  KEY `codUnidade` (`codUnidade`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`),
  CONSTRAINT `produtos_ibfk_2` FOREIGN KEY (`codGrupo`) REFERENCES `grupos` (`codGrupo`),
  CONSTRAINT `produtos_ibfk_3` FOREIGN KEY (`codMarca`) REFERENCES `marcas` (`codMarca`),
  CONSTRAINT `produtos_ibfk_4` FOREIGN KEY (`codUnidade`) REFERENCES `unidades_medidas` (`codUnidade`)
);
DROP TABLE IF EXISTS `unidades_medidas`;
create table `unidades_medidas`(
  codUnidade int(11) not null auto_increment,
  unidade varchar(10) not null,
  codUsuario int(11) not null,
  criado_em timestamp NOT NULL DEFAULT current_timestamp(),
  atualizado_em timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codUnidade`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `unidades_medidas_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);
DROP TABLE IF EXISTS `marcas`;
CREATE TABLE `marcas`(
`codMarca` int(11) not null primary key auto_increment,
`marca` varchar(20) not null,
`codUsuario` int(11) not null,
`criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
`atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
KEY `codUsuario` (`codUsuario`),
CONSTRAINT `marcas_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);
DROP TABLE IF EXISTS `grupos`;
CREATE TABLE grupos (
    codGrupo INT(11) NOT NULL AUTO_INCREMENT,
    grupo VARCHAR(20) NOT NULL,
    codUsuario INT(11) NOT NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (codGrupo),
    KEY `codUsuario` (`codUsuario`),
    CONSTRAINT `grupos_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);

DROP TABLE IF EXISTS `cargos`;
CREATE TABLE `cargos` (
  `codCargo` int(11) NOT NULL AUTO_INCREMENT,
  `cargo` varchar(15) NOT NULL,
  `codUsuario` INT(11) NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codCargo`),
  UNIQUE KEY `cargo` (`cargo`),
KEY `codUsuario` (`codUsuario`),
    CONSTRAINT `grupos_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)

);
DROP TABLE IF EXISTS `transportadores`;

CREATE TABLE `transportadores` (
  `codTransp` int(11) NOT NULL AUTO_INCREMENT,
  `apelido_NomeFantasia` varchar(50) not null,
  `transportador` varchar(50) DEFAULT NULL,
  `inscEstTransp` varchar(30) DEFAULT NULL,
  `tipoPessoa` varchar(1) not null,
  `cpf_cnpjTransp` varchar(20) DEFAULT NULL,
  `ender` varchar(50) DEFAULT NULL,
  `numero` varchar(4) DEFAULT NULL,
  `complemento` varchar(20) DEFAULT NULL,
  `bairro` varchar(30) DEFAULT NULL,
  `codCidade` int(11) DEFAULT NULL,
  `cep` varchar(8) DEFAULT NULL,
  `site` varchar(50) DEFAULT NULL,
  `fone` varchar(20) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `ativo` bool not null,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codTransp`),
  KEY `codCidade` (`codCidade`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `transportadores_ibfk_1` FOREIGN KEY (`codCidade`) REFERENCES `cidades` (`codCidade`),
  CONSTRAINT `transportadores_ibfk_2` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `codUsuario` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `codFuncionario` int(11) not null,
  `codCargo` int(11) NOT NULL,
  `ativo` bool not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codUsuario`),
  UNIQUE KEY `usuario` (`usuario`),
  KEY `codCargo` (`codCargo`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`codCargo`) REFERENCES `cargos` (`codCargo`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`codFuncionario`) REFERENCES `funcionarios` (`codFuncionario`)
);
-- perguntar como vai colocar o id do usuario que editou o registro na tabela de usuarios
drop table if exists funcionarios;
create table funcionarios(
    `codFuncionario` int(11) not null auto_increment,
    `funcionario` varchar(25) not null,
    `cpf` varchar(11) not null unique,
    `data_nascimento` varchar(11) not null,
    `sexo` varchar(1) not null,
    `codCargo` int(11) not null,
    `ender` varchar(50) DEFAULT NULL,
    `numero` varchar(4) DEFAULT NULL,
    `complemento` varchar(20) DEFAULT NULL,
    `bairro` varchar(30) DEFAULT NULL,
    `codCidade` int(11) DEFAULT NULL,
    `cep` varchar(8) DEFAULT NULL,
    `fone` varchar(20) DEFAULT NULL,
    `codUsuario` int(11) not null,
    `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
    `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

    PRIMARY KEY (`codFuncionario`),
    KEY `codCidade` (`codCidade`),
    CONSTRAINT `funcionarios_ibfk_1` FOREIGN KEY (`codCidade`) REFERENCES `cidades` (`codCidade`),
    KEY `codCargo` (`codCargo`),
    CONSTRAINT `funcionarios_ibfk_2` FOREIGN KEY (`codCargo`) REFERENCES `cargos` (`codCargo`),
    KEY `codUsuario` (`codUsuario`),
    CONSTRAINT `funcionarios_ibfk_3` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
 );



DROP TABLE IF EXISTS `veiculos`;
CREATE TABLE `veiculos` (
  `codVeiculo` int(11) NOT NULL AUTO_INCREMENT,
  `placaVeiculo` varchar(10) DEFAULT NULL,
  `placaMercosul` varchar(11) default null,
  `chassi` varchar(17) default null,
  `codModelo` int(11) not null,
  `codTransportador` int(11) not null,
  `codEstado` int(11) DEFAULT NULL,
  `codANTT` varchar(20) DEFAULT NULL,
  `codUsuario` int(11) not null,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

  PRIMARY KEY (`codVeiculo`),
  KEY `codEstado` (`codEstado`),
  CONSTRAINT `veiculo_ibfk_1` FOREIGN KEY (`codEstado`) REFERENCES `estados` (`codEstado`),
  KEY `codTransportador` (`codTransportador`),
  CONSTRAINT `veiculo_ibfk_2` FOREIGN KEY (`codTransportador`) REFERENCES `transportadores` (`codTransp`),
  KEY `codModelo` (`codModelo`),
  CONSTRAINT `veiculo_ibfk_3` FOREIGN KEY (`codModelo`) REFERENCES `modelos` (`codModelo`),
  KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `veiculo_ibfk_4` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`)
);
drop table if exists modelos;
create table `Modelos`(
`codModelo` int(11) not null primary key auto_increment,
`modelo` varchar(15) not null,
`codMarca` int(11) not null,
`codUsuario` int(11) not null,
`criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
`atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),

KEY `codUsuario` (`codUsuario`),
  CONSTRAINT `Modelos_ibfk_1` FOREIGN KEY (`codUsuario`) REFERENCES `usuarios` (`codUsuario`),
Key `codMarca` (`codMarca`),
  CONSTRAINT `Modelos_ibfk_2` FOREIGN KEY (`codMarca`) REFERENCES `marcas` (`codMarca`)
);

SET FOREIGN_KEY_CHECKS = 1;

