-- MySQL dump 10.13  Distrib 8.0.18, for osx10.15 (x86_64)
--
-- Host: localhost    Database: office
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `office`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `office` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `office`;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Department A'),(2,'Department B'),(3,'Department C');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_log`
--

DROP TABLE IF EXISTS `login_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_pw` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `success` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_log`
--

LOCK TABLES `login_log` WRITE;
/*!40000 ALTER TABLE `login_log` DISABLE KEYS */;
INSERT INTO `login_log` VALUES (1,'u1',NULL,'::1',1),(2,'u1',NULL,'::ffff:127.0.0.1',1),(3,'u1',NULL,'::ffff:127.0.0.1',1),(4,'u1',NULL,'::ffff:127.0.0.1',1);
/*!40000 ALTER TABLE `login_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `place`
--

DROP TABLE IF EXISTS `place`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `place` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL COMMENT '0:static staff sit 1:floating staff sit 2:meeting room',
  `using` tinyint(1) NOT NULL,
  `staff_sql_id` int(11) unsigned DEFAULT NULL,
  `code` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `staff_sql_id` (`staff_sql_id`),
  CONSTRAINT `place_ibfk_1` FOREIGN KEY (`staff_sql_id`) REFERENCES `staff` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `place`
--

LOCK TABLES `place` WRITE;
/*!40000 ALTER TABLE `place` DISABLE KEYS */;
INSERT INTO `place` VALUES (1,0,0,3,'1000'),(2,0,0,6,'1001'),(3,1,0,5,'2101'),(4,1,0,4,'2102'),(5,1,0,NULL,'2103'),(6,2,0,2,'MEETING1'),(7,2,0,NULL,'MEETING2'),(8,3,0,NULL,'MEETING3'),(9,0,0,9,'1002');
/*!40000 ALTER TABLE `place` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `position`
--

DROP TABLE IF EXISTS `position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `position` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `permission` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `position`
--

LOCK TABLES `position` WRITE;
/*!40000 ALTER TABLE `position` DISABLE KEYS */;
INSERT INTO `position` VALUES (1,'Tier 1',20),(2,'Tier 2',50),(3,'Tier 3',70);
/*!40000 ALTER TABLE `position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `surname` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `firstname` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `contactno` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `position_id` int(11) unsigned NOT NULL,
  `online` int(1) unsigned NOT NULL DEFAULT '0',
  `department_id` int(11) unsigned DEFAULT NULL,
  `web_username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
  `web_password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'sha1base64',
  PRIMARY KEY (`id`),
  KEY `position_id` (`position_id`),
  CONSTRAINT `staff_ibfk_1` FOREIGN KEY (`position_id`) REFERENCES `position` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES (1,'1231232','Edward','Pritchard','91243124',1,0,1,'u1','u4IDDbwryroyqQvy4geoSoVvxfAzt3xICDarb3f0Dxk='),(2,'6143212','Eleri','Liu','68123421',2,1,1,'u2','bKICyI5Unf9owJv6+/xgsvrAdN68Hmd36bpLbHA+0RQ='),(3,'8245612','Fintan','North','56145232',3,1,1,'u3','AR457+IlkPSjOa0ZzRgPTYVeMv66YC0eyOFUeAg4yZw='),(4,'7624532','Marcelina','Reyna','93154233',1,1,2,'u4','6cmBpHmYYhW6sL9sMu/voUhSU0sTjDUJ2Dae3VEDY9o='),(5,'7134512','Toyah','Calderon','98534623',2,1,2,'u5','WFCgPoAf+xCNoRYOM3OXlEMAS55nCt3zMADcqQRfpBM='),(6,'2453456','Krystian','Hubbard','64125425',3,1,2,'u6','cepfW5YhmMXQUydl5+ks3QUZRWuz1zUpflNdyrF7+E0='),(7,'563242','Charley','Dixon','52145425',1,0,3,'u7','6BgAAPpn6CQEOqUixnQ95X28XeHTnVSDrLYYtpmp3QA='),(8,'2141323','Kamron','Hale','61346343',2,0,3,'u8','yJlRokxsoowT/Rz9xkaytlbWnmGpK5ECO+frWOuRS2s='),(9,'146354','Nayla','Mclean','93521455',3,1,3,'u9','VT8mq+7r5L4YYD88Fbv2zTEGAC6GnOknUFSGj7DWEK8=');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-11 22:05:40
