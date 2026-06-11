-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: erp
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cidades`
--

DROP TABLE IF EXISTS `cidades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cidades` (
  `codCidade` int(11) NOT NULL AUTO_INCREMENT,
  `cidade` varchar(100) DEFAULT NULL,
  `codEstado` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codCidade`),
  KEY `codEstado` (`codEstado`),
  CONSTRAINT `cidades_ibfk_1` FOREIGN KEY (`codEstado`) REFERENCES `estados` (`codEstado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cidades`
--

LOCK TABLES `cidades` WRITE;
/*!40000 ALTER TABLE `cidades` DISABLE KEYS */;
/*!40000 ALTER TABLE `cidades` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condicao_pagamento_parcelas`
--

DROP TABLE IF EXISTS `condicao_pagamento_parcelas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condicao_pagamento_parcelas` (
  `codParcela` int(11) NOT NULL AUTO_INCREMENT,
  `codCondPagamento` int(11) NOT NULL,
  `numeroParcela` int(11) NOT NULL,
  `diasVencimento` int(11) NOT NULL,
  `percentual` decimal(5,2) DEFAULT 100.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codParcela`),
  KEY `codCondPagamento` (`codCondPagamento`),
  CONSTRAINT `condicao_pagamento_parcelas_ibfk_1` FOREIGN KEY (`codCondPagamento`) REFERENCES `condicoes_pagamento` (`codCondPagamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condicao_pagamento_parcelas`
--

LOCK TABLES `condicao_pagamento_parcelas` WRITE;
/*!40000 ALTER TABLE `condicao_pagamento_parcelas` DISABLE KEYS */;
/*!40000 ALTER TABLE `condicao_pagamento_parcelas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `condicoes_pagamento`
--

DROP TABLE IF EXISTS `condicoes_pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `condicoes_pagamento` (
  `codCondPagamento` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `qtdParcelas` int(11) NOT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codCondPagamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `condicoes_pagamento`
--

LOCK TABLES `condicoes_pagamento` WRITE;
/*!40000 ALTER TABLE `condicoes_pagamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `condicoes_pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estados`
--

DROP TABLE IF EXISTS `estados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estados` (
  `codEstado` int(11) NOT NULL AUTO_INCREMENT,
  `UF` char(2) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `codPais` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codEstado`),
  KEY `codPais` (`codPais`),
  CONSTRAINT `estados_ibfk_1` FOREIGN KEY (`codPais`) REFERENCES `paises` (`codPais`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estados`
--

LOCK TABLES `estados` WRITE;
/*!40000 ALTER TABLE `estados` DISABLE KEYS */;
INSERT INTO `estados` VALUES (2,'PR','PARANA',1,'2026-06-09 12:21:39','2026-06-09 12:21:39');
/*!40000 ALTER TABLE `estados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `formas_pagamento`
--

DROP TABLE IF EXISTS `formas_pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formas_pagamento` (
  `codFormaPagamento` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` varchar(100) NOT NULL,
  `ativo` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codFormaPagamento`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `formas_pagamento`
--

LOCK TABLES `formas_pagamento` WRITE;
/*!40000 ALTER TABLE `formas_pagamento` DISABLE KEYS */;
INSERT INTO `formas_pagamento` VALUES (1,'Dinheiro Físico',1,'2026-06-09 13:57:08','2026-06-09 13:57:08');
/*!40000 ALTER TABLE `formas_pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornecedores`
--

DROP TABLE IF EXISTS `fornecedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedores` (
  `codForn` int(11) NOT NULL AUTO_INCREMENT,
  `RazaoSocial` varchar(150) DEFAULT NULL,
  `ender` varchar(150) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `codCidade` int(11) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `fone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `inscEst` varchar(30) DEFAULT NULL,
  `InscEstSubTrib` varchar(30) DEFAULT NULL,
  `cnpj` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codForn`),
  KEY `codCidade` (`codCidade`),
  CONSTRAINT `fornecedores_ibfk_1` FOREIGN KEY (`codCidade`) REFERENCES `cidades` (`codCidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedores`
--

LOCK TABLES `fornecedores` WRITE;
/*!40000 ALTER TABLE `fornecedores` DISABLE KEYS */;
/*!40000 ALTER TABLE `fornecedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs`
--

DROP TABLE IF EXISTS `logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idUser` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idUser` (`idUser`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs`
--

LOCK TABLES `logs` WRITE;
/*!40000 ALTER TABLE `logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ncm_sh`
--

DROP TABLE IF EXISTS `ncm_sh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ncm_sh` (
  `ncmSh` varchar(10) NOT NULL,
  `aliqIcmsProdNFe` decimal(10,2) DEFAULT NULL,
  `aliqIpiProdNFe` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ncmSh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ncm_sh`
--

LOCK TABLES `ncm_sh` WRITE;
/*!40000 ALTER TABLE `ncm_sh` DISABLE KEYS */;
/*!40000 ALTER TABLE `ncm_sh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nfe`
--

DROP TABLE IF EXISTS `nfe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nfe` (
  `numNfe` int(11) NOT NULL,
  `serie` int(11) NOT NULL,
  `modelo` int(11) NOT NULL,
  `codForn` int(11) NOT NULL,
  `pagina` int(11) DEFAULT NULL,
  `natOper` varchar(100) DEFAULT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nfe`
--

LOCK TABLES `nfe` WRITE;
/*!40000 ALTER TABLE `nfe` DISABLE KEYS */;
/*!40000 ALTER TABLE `nfe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paises`
--

DROP TABLE IF EXISTS `paises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `paises` (
  `codPais` int(11) NOT NULL AUTO_INCREMENT,
  `Pais` varchar(100) DEFAULT NULL,
  `sigla` char(3) DEFAULT NULL,
  `DDI` varchar(5) DEFAULT NULL,
  `moeda` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codPais`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paises`
--

LOCK TABLES `paises` WRITE;
/*!40000 ALTER TABLE `paises` DISABLE KEYS */;
INSERT INTO `paises` VALUES (1,'Brasil','BR','55','Real','2026-06-08 14:31:16','2026-06-08 14:31:16');
/*!40000 ALTER TABLE `paises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prod_nfe`
--

DROP TABLE IF EXISTS `prod_nfe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`numNfe`,`serie`,`modelo`,`codProd`),
  KEY `codProd` (`codProd`),
  CONSTRAINT `prod_nfe_ibfk_1` FOREIGN KEY (`numNfe`, `serie`, `modelo`) REFERENCES `nfe` (`numNfe`, `serie`, `modelo`),
  CONSTRAINT `prod_nfe_ibfk_2` FOREIGN KEY (`codProd`) REFERENCES `produtos` (`codProd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prod_nfe`
--

LOCK TABLES `prod_nfe` WRITE;
/*!40000 ALTER TABLE `prod_nfe` DISABLE KEYS */;
/*!40000 ALTER TABLE `prod_nfe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `codProd` int(11) NOT NULL,
  `descProd` varchar(150) DEFAULT NULL,
  `NCMSHPROD` varchar(10) DEFAULT NULL,
  `undProd` int(11) DEFAULT NULL,
  `pesoBruto` decimal(10,2) DEFAULT NULL,
  `pesoLiq` decimal(10,2) DEFAULT NULL,
  `saldoProd` decimal(10,2) DEFAULT NULL,
  `custoMedioProd` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codProd`),
  KEY `NCMSHPROD` (`NCMSHPROD`),
  CONSTRAINT `produtos_ibfk_1` FOREIGN KEY (`NCMSHPROD`) REFERENCES `ncm_sh` (`ncmSh`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'master','2026-06-09 11:34:37','2026-06-09 11:40:17'),(3,'funcionario','2026-06-09 11:34:50','2026-06-09 11:34:50'),(5,'estagiario','2026-06-09 11:54:54','2026-06-09 11:54:54');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transportadores`
--

DROP TABLE IF EXISTS `transportadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transportadores` (
  `codTransp` int(11) NOT NULL AUTO_INCREMENT,
  `cpf_cnpjTransp` varchar(20) DEFAULT NULL,
  `endTransp` varchar(150) DEFAULT NULL,
  `codCidade` int(11) DEFAULT NULL,
  `razaoSocTransp` varchar(150) DEFAULT NULL,
  `inscEstTransp` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codTransp`),
  KEY `codCidade` (`codCidade`),
  CONSTRAINT `transportadores_ibfk_1` FOREIGN KEY (`codCidade`) REFERENCES `cidades` (`codCidade`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transportadores`
--

LOCK TABLES `transportadores` WRITE;
/*!40000 ALTER TABLE `transportadores` DISABLE KEYS */;
/*!40000 ALTER TABLE `transportadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `roleid` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `roleid` (`roleid`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`roleid`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'moha','moha3010',1,'2026-06-09 16:40:06','2026-06-09 16:40:06');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `veiculo`
--

DROP TABLE IF EXISTS `veiculo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `veiculo` (
  `codVeic` int(11) NOT NULL AUTO_INCREMENT,
  `placaVeic` varchar(10) DEFAULT NULL,
  `codEstado` int(11) DEFAULT NULL,
  `codANTT` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`codVeic`),
  KEY `codEstado` (`codEstado`),
  CONSTRAINT `veiculo_ibfk_1` FOREIGN KEY (`codEstado`) REFERENCES `estados` (`codEstado`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `veiculo`
--

LOCK TABLES `veiculo` WRITE;
/*!40000 ALTER TABLE `veiculo` DISABLE KEYS */;
/*!40000 ALTER TABLE `veiculo` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-11 19:28:57
