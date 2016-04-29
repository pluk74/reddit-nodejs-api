-- This creates the users table. The username field is constrained to unique
-- values only, by using a UNIQUE KEY on that column
CREATE TABLE `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(60) NOT NULL, -- why 60??? ask me :)
  `createdAt` TIMESTAMP NOT NULL DEFAULT 0,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


--creates subreddits table.
CREATE TABLE `subreddits` (
  `subredditsId` int(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(30) NOT NULL,
  `description` varchar(200) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT 0,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT pk_subredditsId PRIMARY KEY(subredditsId),
  CONSTRAINT uk_name UNIQUE KEY (name)
);


-- This creates the posts table. The userId column references the id column of
-- users. If a user is deleted, the corresponding posts' userIds will be set NULL.
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `url` varchar(2000) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `subredditId` int(11) NOT NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT 0,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT fk_userId_users_usersId1 FOREIGN KEY (userId) REFERENCES `users` (`id`),
  CONSTRAINT `fk_posts_subredditId_subreddits_subredditsId1` FOREIGN KEY(subredditId) REFERENCES subreddits(subredditsId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE comments (
  commentId int(11) NOT NULL AUTO_INCREMENT,
  commentText varchar(10000) NULL,
  `createdAt` TIMESTAMP NOT NULL DEFAULT 0,
  `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` int(11) NOT NULL,
  `postId` int(11) NOT NULL,
  parentId int(11) NULL,
  PRIMARY KEY(commentId),
  CONSTRAINT fk_comments_userId_users_usersId FOREIGN KEY (`userId`) REFERENCES `users` (`id`),
  CONSTRAINT fk_comments_postId_posts_id FOREIGN KEY (postId) REFERENCES posts(id)
);


CREATE TABLE votes (
	postId int(11) NOT NULL,
	userId INT(11) NOT NULL,
	vote  TINYINT NOT NULL,
	createdAt TIMESTAMP NOT NULL DEFAULT 0,
	updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY pk_postId_userId (postId, userId),
	CONSTRAINT fk_votes_postId_posts_id FOREIGN KEY (postId) REFERENCES posts (id),
	CONSTRAINT fk_votes_userId_users_id FOREIGN KEY (userId) REFERENCES users (id)
);
