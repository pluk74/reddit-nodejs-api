-- MySQL dump 10.13  Distrib 5.5.47, for debian-linux-gnu (x86_64)
--
-- Host: 0.0.0.0    Database: reddit_workshop
-- ------------------------------------------------------
-- Server version	5.5.47-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `commentId` int(11) NOT NULL AUTO_INCREMENT,
  `commentText` varchar(10000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`commentId`),
  KEY `fk_comments_userId_users_usersId` (`userId`),
  KEY `fk_comments_postId_posts_id` (`postId`),
  CONSTRAINT `fk_comments_postId_posts_id` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  CONSTRAINT `fk_comments_userId_users_usersId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'good stuff!','2016-04-28 21:39:43','2016-04-28 21:39:43',3,2,NULL),(2,'I like it','2016-04-28 21:40:27','2016-04-28 21:40:27',5,2,NULL),(3,'I agree','2016-04-28 21:41:19','2016-04-28 21:41:19',5,2,1),(4,'no, you do not','2016-04-29 16:13:00','2016-04-29 16:13:00',9,2,3);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `subredditId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_userId_users_usersId1` (`userId`),
  KEY `fk_posts_subredditId_subreddits_subredditsId1` (`subredditId`),
  CONSTRAINT `fk_posts_subredditId_subreddits_subredditsId1` FOREIGN KEY (`subredditId`) REFERENCES `subreddits` (`subredditsId`),
  CONSTRAINT `fk_userId_users_usersId1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (2,'look at this','https://www.reddit.com',9,1,'2016-04-28 21:13:54','2016-04-28 21:13:54'),(3,'What is this','www.decodemtl.com',1,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(4,'check this out','www.decodemtl.com',3,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(5,'why am I here','www.decodemtl.com',6,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(6,'I saw a ufo','www.decodemtl.com',5,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(7,'what is the meaning of life','www.decodemtl.com',6,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(8,'the earth is flat','www.decodemtl.com',6,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(9,'the sun is hallow','www.decodemtl.com',1,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(10,'we live in the matrix','www.decodemtl.com',6,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(11,'my dog is funny','www.decodemtl.com',5,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(12,'derpy dog','www.decodemtl.com',3,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(13,'I hate reddit','www.decodemtl.com',6,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(14,'whats new','www.decodemtl.com',8,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(15,'what did you eat today','www.decodemtl.com',6,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(16,'look at what I broke','www.decodemtl.com',8,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(17,'guess who I met today','www.decodemtl.com',6,1,'0000-00-00 00:00:00','2016-05-02 20:51:00'),(18,'I need a holiday','www.decodemtl.com',9,1,'0000-00-00 00:00:00','2016-05-02 20:51:00');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subreddits`
--

DROP TABLE IF EXISTS `subreddits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subreddits` (
  `subredditsId` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `description` varchar(200) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`subredditsId`),
  UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subreddits`
--

LOCK TABLES `subreddits` WRITE;
/*!40000 ALTER TABLE `subreddits` DISABLE KEYS */;
INSERT INTO `subreddits` VALUES (1,'politics',NULL,'0000-00-00 00:00:00','2016-04-28 21:11:52');
/*!40000 ALTER TABLE `subreddits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(60) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hello23','$2a$10$X2vP6qs7r417V6sEiroZOOFOLEC92XKUZUFl8elew3xaxbUggZEo.','2016-04-28 20:51:54','2016-04-28 20:51:54'),(3,'george','$2a$10$McES1bn7F67f0wI0aEPjneQxXo0/EyZr8Z8tg1oNu/FFb16TZx7eK','2016-04-28 20:54:21','2016-04-28 20:54:21'),(5,'peter','$2a$10$Aeoh0gVqdVF2WODlwS1ar.CsP2qZURxbA/rlKm6hHnoI7YBP7.fwO','2016-04-28 21:07:26','2016-04-28 21:07:26'),(6,'kramer','$2a$10$wGRb0KnUg2o7ZOv7ucHLD.QrGSv8whqJS7ALE52l7XjOYPtjaqj4q','2016-04-28 21:08:50','2016-04-28 21:08:50'),(8,'newman','$2a$10$UZlv9M6y8MRuYhrVZm7JbuNEssPgUY0vcvpRRcSZciHHHR7SuKai2','2016-04-28 21:09:26','2016-04-28 21:09:26'),(9,'david','$2a$10$EBTkiNZhnjSI6GN/CJ3wmeHrxYG.58Jb1IizZ4UVT8FdZwJPKyNQK','2016-04-28 21:13:54','2016-04-28 21:13:54');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `votes` (
  `postId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `vote` tinyint(4) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`postId`,`userId`),
  KEY `fk_votes_userId_users_id` (`userId`),
  CONSTRAINT `fk_votes_postId_posts_id` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`),
  CONSTRAINT `fk_votes_userId_users_id` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-05-02 21:22:51
