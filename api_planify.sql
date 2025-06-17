-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for api_planify
CREATE DATABASE IF NOT EXISTS `api_planify` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `api_planify`;

-- Dumping structure for table api_planify.calender_events
CREATE TABLE IF NOT EXISTS `calender_events` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `workbook_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_by` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `link` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `calender_events_user_id_foreign` (`user_id`),
  KEY `calender_events_workbook_id_foreign` (`workbook_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table api_planify.calender_events: ~0 rows (approximately)
INSERT INTO `calender_events` (`id`, `user_id`, `workbook_id`, `title`, `description`, `status`, `created_by`, `start_date`, `end_date`, `link`, `file`, `created_at`, `updated_at`) VALUES
	(2, 11, 1, 'Meeting Tim A', 'Diskusi roadmap Q3', 'active', 'mikhael', '2025-06-04 10:00:00', '2025-06-04 11:00:00', 'https://zoom.us/123', 'dokumen.pdf', '2025-06-03 21:42:14', '2025-06-03 21:42:14');

-- Dumping structure for table api_planify.notes
CREATE TABLE IF NOT EXISTS `notes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `workbook_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `notes_user_id_foreign` (`user_id`),
  KEY `notes_workbook_id_foreign` (`workbook_id`),
  CONSTRAINT `notes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `notes_workbook_id_foreign` FOREIGN KEY (`workbook_id`) REFERENCES `workbooks` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table api_planify.notes: ~0 rows (approximately)

-- Dumping structure for table api_planify.payment
CREATE TABLE IF NOT EXISTS `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL DEFAULT '0',
  `amount` bigint NOT NULL DEFAULT '0',
  `payment_method` varchar(50) NOT NULL,
  `payment_date` date NOT NULL,
  `status` enum('pending','confirmed','rejected') NOT NULL DEFAULT 'pending',
  `image` text NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table api_planify.payment: ~3 rows (approximately)
INSERT INTO `payment` (`id`, `user_id`, `amount`, `payment_method`, `payment_date`, `status`, `image`, `created_at`, `updated_at`) VALUES
	(11, 9, 50000, 'transfer', '2025-06-09', 'pending', 'PAYMENTS_9/1749475323462.jpg', '2025-06-09 20:22:03', '2025-06-09 20:22:03'),
	(12, 11, 50000, 'transfer', '2025-06-10', 'confirmed', 'PAYMENTS_11/1749535855364.jpg', '2025-06-10 13:10:55', '2025-06-10 13:11:25'),
	(13, 12, 50000, 'transfer', '2025-06-10', 'confirmed', 'PAYMENTS_12/1749566486941.jpeg', '2025-06-10 21:41:27', '2025-06-10 21:42:58');

-- Dumping structure for table api_planify.personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table api_planify.personal_access_tokens: ~11 rows (approximately)
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
	(1, 'App\\Models\\User', 1, 'auth_token', 'eae12307ea1674166eb7667d63cf619511663a72493efd05d6a6df7de993c4a0', '["*"]', '2025-06-04 01:43:17', NULL, '2025-06-03 21:08:34', '2025-06-04 01:43:17'),
	(2, 'App\\Models\\User', 1, 'auth_token', '617b7af2a4081ee17f20f049ad6c20c955368497529b2e6ae71e9882d359d473', '["*"]', NULL, NULL, '2025-06-04 01:20:55', '2025-06-04 01:20:55'),
	(3, 'App\\Models\\User', 1, 'auth_token', 'aef341ba2100de2cd6ad628e131f6ab50f3a46054904f22d90dc7527703bce3f', '["*"]', NULL, NULL, '2025-06-04 01:22:05', '2025-06-04 01:22:05'),
	(4, 'App\\Models\\User', 1, 'auth_token', '01ed761f20d0bb350d5945bc82ce299004c8d18f532447b7b8503dc12addfcd0', '["*"]', NULL, NULL, '2025-06-04 01:23:02', '2025-06-04 01:23:02'),
	(5, 'App\\Models\\User', 1, 'auth_token', 'a9b3bea7bb1c5fae70f5c8ddf2039e01c590924092143abe6dc20934e0069a2b', '["*"]', NULL, NULL, '2025-06-04 01:23:03', '2025-06-04 01:23:03'),
	(6, 'App\\Models\\User', 1, 'auth_token', '9bcea3fec3b0aa2fd4596cf8655a3f6ec2e8e7325f9646325e5056478f50a823', '["*"]', NULL, NULL, '2025-06-04 01:23:34', '2025-06-04 01:23:34'),
	(7, 'App\\Models\\User', 1, 'auth_token', 'f6e7cabe59649a27313c071eaef82beda9be2918c4a4f7c0ad050a6d06bf1547', '["*"]', NULL, NULL, '2025-06-04 01:23:54', '2025-06-04 01:23:54'),
	(8, 'App\\Models\\User', 1, 'auth_token', '4d5962ceb1c0641f7bd53f4c9fa93d79f61f337349d5aa9798b7d47bc63b3ed0', '["*"]', NULL, NULL, '2025-06-04 01:24:05', '2025-06-04 01:24:05'),
	(9, 'App\\Models\\User', 1, 'auth_token', 'd0af739e4fc30542ed70b89288b8cda37a9fff51c3ee5a08c8338ef3f8cc250b', '["*"]', NULL, NULL, '2025-06-04 01:24:10', '2025-06-04 01:24:10'),
	(10, 'App\\Models\\User', 1, 'auth_token', '53b56303fdd3971a10c0920590bf10455ccba043152d0f3738f3a94e42d8242e', '["*"]', NULL, NULL, '2025-06-04 01:25:06', '2025-06-04 01:25:06'),
	(11, 'App\\Models\\User', 1, 'auth_token', 'ceddc0c130b5b5ae4a1ad69be980ef93c980edc6825d5e639469e723a3c7931b', '["*"]', '2025-06-04 02:37:30', NULL, '2025-06-04 01:25:18', '2025-06-04 02:37:30');

-- Dumping structure for table api_planify.sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table api_planify.sessions: ~0 rows (approximately)

-- Dumping structure for table api_planify.tasks
CREATE TABLE IF NOT EXISTS `tasks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `workbook_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `due_date` date NOT NULL,
  `due_date_reminder` date NOT NULL,
  `reminder_time` time NOT NULL,
  `link_file` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipe` enum('todo','doing','done') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'todo',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_user_id_foreign` (`user_id`),
  KEY `tasks_workbook_id_foreign` (`workbook_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table api_planify.tasks: ~6 rows (approximately)
INSERT INTO `tasks` (`id`, `user_id`, `workbook_id`, `title`, `description`, `due_date`, `due_date_reminder`, `reminder_time`, `link_file`, `tipe`, `created_at`, `updated_at`) VALUES
	(6, 11, 37, 'asd', 'asd', '2025-06-10', '2025-06-11', '19:29:00', '', 'todo', '2025-06-10 12:30:52', '2025-06-10 12:30:52'),
	(7, 11, 37, 'asd', 'asd', '2025-06-10', '2025-06-11', '19:29:00', '', 'todo', '2025-06-10 12:31:24', '2025-06-10 12:31:24'),
	(8, 11, 37, 'asd', 'asd', '2025-06-10', '2025-06-11', '19:29:00', '', 'todo', '2025-06-10 12:31:39', '2025-06-10 12:31:39'),
	(9, 11, 37, 'asd', 'asd', '2025-06-10', '2025-06-12', '21:02:00', '', 'doing', '2025-06-10 14:10:51', '2025-06-10 14:10:51'),
	(10, 11, 37, 'asd', 'asd', '2025-06-10', '2025-06-10', '21:11:00', '', 'done', '2025-06-10 14:11:19', '2025-06-10 14:11:19'),
	(11, 11, 37, 'dsa', 'asd', '2025-06-10', '2025-06-10', '21:38:00', '', 'todo', '2025-06-10 14:38:55', '2025-06-10 14:38:55');

-- Dumping structure for table api_planify.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `photo_profile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `providers` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tier` enum('free','premium','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'free',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table api_planify.users: ~2 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `photo_profile`, `providers`, `tier`, `remember_token`, `created_at`, `updated_at`) VALUES
	(11, 'gura', 'gura@gmail.com', NULL, '$2b$10$uVyo8Ynd4aaaQHsSocyB5eylVmGVfWvxsg1wADazSVb5Rdp6jlqyS', '/uploads/PROFILE_11/1749566133197.jpeg', 'login', 'admin', NULL, '2025-06-09 11:04:23', '2025-06-10 14:35:39'),
	(12, 'Chodan', 'chod@gmail.com', NULL, '$2b$10$rpwJv3OcyQ8r94cA.4tv4OTnrjO3CSPTKveQWwvhvKRDmEp/rRotW', '/uploads/PROFILE_DEFAULT/default_profile_pic.jpg', 'login', 'premium', NULL, '2025-06-10 14:34:04', '2025-06-10 14:42:58');

-- Dumping structure for table api_planify.workbooks
CREATE TABLE IF NOT EXISTS `workbooks` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `last_edited_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `workbooks_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table api_planify.workbooks: ~2 rows (approximately)
INSERT INTO `workbooks` (`id`, `user_id`, `title`, `thumbnail`, `is_archived`, `last_edited_at`, `created_at`, `updated_at`) VALUES
	(37, 11, 'sea', 'http://127.0.0.1:3000/uploads/WORKBOOK_11/1749475869295.jpg', 0, '2025-06-09 13:31:10', '2025-06-09 13:31:10', '2025-06-09 13:31:10'),
	(38, 11, 'eas', 'http://127.0.0.1:3000/uploads/WORKBOOK_11/1749566248181.jpeg', 0, '2025-06-10 14:37:29', '2025-06-10 14:37:29', '2025-06-10 14:37:29'),
	(39, 12, 'sss', 'http://127.0.0.1:3000/uploads/WORKBOOK_12/1749567751682.jpg', 0, '2025-06-10 15:02:33', '2025-06-10 15:02:33', '2025-06-10 15:02:33');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
