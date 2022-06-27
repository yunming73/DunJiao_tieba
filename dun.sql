/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 8.0.28 : Database - postdb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`postdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `postdb`;

/*Table structure for table `ba_admin_application` */

DROP TABLE IF EXISTS `ba_admin_application`;

CREATE TABLE `ba_admin_application` (
  `aa_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '吧务申请',
  `aa_user_id` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '发送人id',
  `aa_takeover_id` varchar(1024) NOT NULL COMMENT '接收人id',
  `aa_post_id` varchar(1024) NOT NULL COMMENT '请求的吧ID',
  `aa_content` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '发送内容',
  `aa_add_time` int NOT NULL COMMENT '添加时间',
  `aa_status` tinyint NOT NULL DEFAULT '0' COMMENT '0:未处理 1：已经处理',
  `aa_result` tinyint NOT NULL DEFAULT '0' COMMENT '处理结果:0:未通过，1：通过',
  PRIMARY KEY (`aa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 COMMENT='文章表';

/*Data for the table `ba_admin_application` */

/*Table structure for table `ba_application` */

DROP TABLE IF EXISTS `ba_application`;

CREATE TABLE `ba_application` (
  `bn_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '贴吧申请',
  `bn_user_id` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '发送人id',
  `bn_takeover_id` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '41' COMMENT '接收人id',
  `bn_ba_name` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '吧的名字',
  `bn_content` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '发送内容',
  `bn_add_time` int NOT NULL COMMENT '添加时间',
  `bn_status` tinyint NOT NULL DEFAULT '0' COMMENT '0:未处理 1：已经处理',
  `bn_result` tinyint NOT NULL DEFAULT '0' COMMENT '处理结果:0:未通过，1：通过',
  PRIMARY KEY (`bn_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COMMENT='文章表';

/*Data for the table `ba_application` */

/*Table structure for table `ba_collect` */

DROP TABLE IF EXISTS `ba_collect`;

CREATE TABLE `ba_collect` (
  `ms_id` int NOT NULL AUTO_INCREMENT,
  `ms_ba_id` int NOT NULL COMMENT '吧id',
  `ms_user_id` int NOT NULL COMMENT '用户id',
  PRIMARY KEY (`ms_id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb3;

/*Data for the table `ba_collect` */

insert  into `ba_collect`(`ms_id`,`ms_ba_id`,`ms_user_id`) values (91,2,41),(92,4,41),(93,5,41),(94,7,41),(95,9,41),(96,10,41),(97,11,41),(98,12,41),(99,3,41);

/*Table structure for table `content_s` */

DROP TABLE IF EXISTS `content_s`;

CREATE TABLE `content_s` (
  `cs_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '从帖子id',
  `cs_floor_num` varchar(1024) NOT NULL COMMENT '从贴楼层数',
  `cs_content` varchar(1024) NOT NULL COMMENT '帖子内容',
  `cs_father_id` bigint NOT NULL COMMENT '帖子跟随的主贴id',
  `cs_user_id` int NOT NULL COMMENT '发布者的ID',
  `cs_img` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '帖子图片路径',
  `cs_post_id` bigint NOT NULL COMMENT '贴吧归属的id',
  `cs_praise` bigint unsigned NOT NULL DEFAULT '0' COMMENT '点赞数',
  `cs_add_time` bigint unsigned NOT NULL DEFAULT '0' COMMENT '帖子添加时间',
  `cs_status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '0:未审核 1：已审核',
  `cs_is_top` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否置顶 1：置顶 0：不置顶',
  PRIMARY KEY (`cs_id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=utf8mb3 COMMENT='文章表';

/*Data for the table `content_s` */

insert  into `content_s`(`cs_id`,`cs_floor_num`,`cs_content`,`cs_father_id`,`cs_user_id`,`cs_img`,`cs_post_id`,`cs_praise`,`cs_add_time`,`cs_status`,`cs_is_top`) values (64,'1','本身除了凯恩就都是垃圾，个个以自我为中心，尤其是阿诺德那****',90,41,'',2,0,1655291256,0,0),(65,'2','这种比赛甚至友谊赛都不如。特别是世界杯年谁会把精力放在这种循环赛上。要是伤了世界杯都没得踢',90,41,'',2,0,1655291263,0,0),(66,'3','户口溢价太高，角色球员多，能独自解决问题的真核心少',90,41,'',2,0,1655291268,0,0),(67,'4','英国这么多年就没啥好表现，感觉空有其表。',90,41,'',2,0,1655291285,0,0),(68,'5','欧国联没有参考价值，英格兰18世界杯 21欧洲杯成绩都还可以，倒是你说的德阿西阵容不好的时候，一个小组出局，一个16强，一个自从14年开始，不是16强就是小组出局的路上',90,41,'',2,0,1655291304,0,0),(69,'6','英格兰不行但是英吹强，什么赖斯格拉利什很普通的球员动不动就是一亿，这凯恩也不见得比卢卡库强，看风评倒是一个天上一个地下，也就这几年签运都不错，所以成绩还算看的过去',90,41,'',2,0,1655291315,0,0),(70,'7','南门要是一英超球队主帅，那就是游走在英超——英冠升降机游戏里的常客。',90,41,'',2,0,1655291322,0,0),(71,'1','露娜阿离？',99,45,'',3,0,1655353024,0,0),(72,'2','我也没有说这英雄很弱，但是他容错率真的很低，只要不是降维打击，路人局里面，这个英雄我感觉是挺好切的',99,45,'',3,0,1655353033,0,0),(73,'3','我也感觉孙尚香好切 控制能打断他一 一交完比呆射还无力',99,45,'',3,0,1655353065,0,0),(74,'4','滚完就是呆b 不滚又a不到人 而且真的好吃好吃好吃经济 我觉得真的有点难玩',99,45,'',3,0,1655353096,0,0),(75,'5','除非带闪现，不然那个一技能因为要用来打伤害不可能一直捏住不放，很容易被找到空当被多位移刺客当成呆射切',99,45,'',3,0,1655353101,0,0),(76,'1','dd',100,45,'',3,0,1655365397,0,0),(77,'2','长期表现的也可以做好朋友啊',100,45,'',3,0,1655365402,0,0),(78,'3','害，谁不是呢，关键是追求数据还打的菜',100,45,'',3,0,1655365410,0,0),(79,'4','你总不能指望别人都喜欢打游戏吧',100,45,'',3,0,1655365417,0,0),(80,'1','如果我厉害就不在这个段位了，我承认我菜。但是队友瞎b玩就没意思了',101,41,'',3,0,1655365548,0,0),(81,'2','黄金局，',101,41,'http://127.0.0.1:99/img/content_img/61971e3a2e468ba83407f1ba689f0f22.jpg',3,0,1655365572,0,0),(82,'3','三个基本英雄',101,41,'',3,0,1655365589,0,0),(83,'4','说得再多都没用，货狠才是最关键，不满意不喜欢随意退',101,42,'',3,0,1655365687,0,0),(84,'1','除非经常玩或者真心很喜欢就买 不然这个钱可以花在现实中应在你本人日常中也挺好',102,43,'',3,0,1655366752,0,0),(85,'2','看你玩不玩耀呗。不玩买它干啥。收藏数据就太笑话了',102,44,'',3,0,1655366784,0,0),(86,'1','30h 混躺不结',103,41,'',4,0,1655367239,0,0),(87,'2','10结赢位置全能',103,41,'',4,0,1655367243,0,0),(88,'3','35/h 少女音\n任何模式都可以打，除了打野都可以补。\n话多开得起玩笑 人皮话多心态好\npyq有照片\n能试音 秒上号\n',103,41,'',4,0,1655367258,0,0),(89,'4','打野豹女皎月莉莉娅 10结赢svp 不猛不结',103,41,'',4,0,1655367270,0,0),(90,'5','来了来了，话痨气氛组的，温柔少御，支持试音，真钻石，不假肢，主中辅的，中单可c，2000场狐狸，35h\n',103,41,'',4,0,1655367276,0,0),(91,'6','35h中辅钻石手法正常音。主页有战绩贴',103,41,'',4,0,1655367280,0,0),(92,'7','符合要求30h少御音话挺多的，家里麦可试音钻2手法，全能补位希望哥哥给个机会',103,41,'',4,0,1655367284,0,0),(93,'8','Ad40h网二最高900本赛季546\n',103,41,'',4,0,1655367290,0,0),(94,'9','25/h，打野ad，稳定c，混躺不要钱',103,41,'',4,0,1655367294,0,0),(95,'10','技术陪 40h 主页音',103,41,'',4,0,1655367299,0,0),(96,'11','随便给 兼职陪 段位高除了中不打 锤石绝活 主页有w',103,41,'',4,0,1655367322,0,0),(97,'12','老板我可以，一把10精通各种位置分段乱杀艾克岩雀绝活哥大师以下当人机打adashu1105\n\n',103,41,'',4,0,1655367326,0,0);

/*Table structure for table `content_s_s` */

DROP TABLE IF EXISTS `content_s_s`;

CREATE TABLE `content_s_s` (
  `ss_id` int NOT NULL AUTO_INCREMENT COMMENT '从帖的评论id',
  `ss_content` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '帖子内容',
  `ss_user_id` varchar(1024) NOT NULL COMMENT '发布者的ID',
  `ss_main_id` varchar(1024) NOT NULL COMMENT '帖子评论跟随的主贴id',
  `ss_father_id` varchar(1024) NOT NULL COMMENT '帖子评论跟随的从贴id',
  `ss_respond_id` varchar(1024) DEFAULT NULL COMMENT '回应帖子评论的用户id',
  `ss_post_id` int NOT NULL COMMENT '贴吧归属的id',
  `ss_add_time` int NOT NULL DEFAULT '0' COMMENT '帖子添加时间',
  `ss_status` tinyint NOT NULL DEFAULT '0' COMMENT '0:未审核 1：已审核',
  PRIMARY KEY (`ss_id`,`ss_post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb3 COMMENT='文章表';

/*Data for the table `content_s_s` */

insert  into `content_s_s`(`ss_id`,`ss_content`,`ss_user_id`,`ss_main_id`,`ss_father_id`,`ss_respond_id`,`ss_post_id`,`ss_add_time`,`ss_status`) values (84,'当然 欧国联不能说明全部问题 谁也不非要拼命','41','90','66',NULL,2,1655291277,0),(85,'我认为就是赛前吹多了引起的。双德贝克汉姆时期，赛前吹的一个比一个厉害，踢起来你发现中场一个过人的没有，一个能持球推进的也没有，进球全靠运气和蒙，能踢的好就怪了','41','90','67',NULL,2,1655291293,0),(86,'123','41','90','67','41',2,1655293525,0),(87,'123456i','41','90','67',NULL,2,1655303202,0),(88,'123456789','41','90','67',NULL,2,1655303208,0),(89,'12345678890','41','90','67',NULL,2,1655303213,0),(90,'1234','41','90','67','41',2,1655304608,0),(91,'得找猛男辅助双排，前期必须开节奏，自己在线上坐牢一坐就是一局。','45','99','72',NULL,3,1655353040,0),(92,'因为一技能是关键输出，也是唯一保命位移的原因吧','45','99','72',NULL,3,1655353049,0),(93,'我也觉得因为要到父亲节了，我准备给我爸买东西','41','102','84',NULL,3,1655366759,0),(94,'你真好 你爸爸会开心的 这个肯定比皮肤重要啦 皮肤只是虚拟数据','42','102','84','41',3,1655366766,0),(96,'surname8618','41','103','86',NULL,4,1655367252,0),(97,' y-02231125','41','103','95',NULL,4,1655367311,0),(98,'谢谢','41','102','84','42',3,1655368456,0);

/*Table structure for table `content_s_user_like` */

DROP TABLE IF EXISTS `content_s_user_like`;

CREATE TABLE `content_s_user_like` (
  `like_s_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '从贴点赞',
  `like_s_aid` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '从帖id',
  `like_s_user_id` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '点赞的用户ip',
  PRIMARY KEY (`like_s_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3 COMMENT='点赞记录表';

/*Data for the table `content_s_user_like` */

insert  into `content_s_user_like`(`like_s_id`,`like_s_aid`,`like_s_user_id`) values (20,'81','41');

/*Table structure for table `content_user` */

DROP TABLE IF EXISTS `content_user`;

CREATE TABLE `content_user` (
  `cu_id` int NOT NULL AUTO_INCREMENT COMMENT '收藏帖子',
  `cu_ba_content_id` int NOT NULL COMMENT '帖子id',
  `cu_user_id` int NOT NULL COMMENT '用户ID',
  PRIMARY KEY (`cu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb3;

/*Data for the table `content_user` */

insert  into `content_user`(`cu_id`,`cu_ba_content_id`,`cu_user_id`) values (82,90,41),(84,102,41),(85,101,41),(86,100,41);

/*Table structure for table `content_user_like` */

DROP TABLE IF EXISTS `content_user_like`;

CREATE TABLE `content_user_like` (
  `like_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主贴点赞',
  `like_aid` varchar(1024) NOT NULL COMMENT '主帖id',
  `like_user_id` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '点赞的用户ip',
  PRIMARY KEY (`like_id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3 COMMENT='点赞记录表';

/*Data for the table `content_user_like` */

insert  into `content_user_like`(`like_id`,`like_aid`,`like_user_id`) values (36,'90','41'),(38,'100','41'),(39,'101','41'),(40,'99','41'),(41,'96','41'),(42,'103','41');

/*Table structure for table `dj_ba` */

DROP TABLE IF EXISTS `dj_ba`;

CREATE TABLE `dj_ba` (
  `ba_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '吧id',
  `ba_name` varchar(128) NOT NULL COMMENT '吧名字',
  `ba_img` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'http://127.0.0.1:99/img/users_img/default.jpeg' COMMENT '吧头像',
  `ba_user_id` int NOT NULL COMMENT '吧主ID',
  `ba_team_ids` char(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '小吧主',
  `ba_signature` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '吧介绍',
  `ba_add_time` int unsigned NOT NULL DEFAULT '0' COMMENT '吧创建时间',
  `ba_status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '0:未审核 1：已审核',
  `ba_comment_status` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '是否可以使用 1：允许 0：不允许',
  `ba_hits` int unsigned NOT NULL DEFAULT '0' COMMENT '关注总数',
  `ba_information` int NOT NULL DEFAULT '0' COMMENT '帖子总数',
  `ba_recommended` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否推荐 1：推荐 0：不推荐',
  `ba_is_recycle` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否回收 1：回收  0：不回收',
  PRIMARY KEY (`ba_id`),
  KEY `fk_ba_users_id` (`ba_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 COMMENT='文章表';

/*Data for the table `dj_ba` */

insert  into `dj_ba`(`ba_id`,`ba_name`,`ba_img`,`ba_user_id`,`ba_team_ids`,`ba_signature`,`ba_add_time`,`ba_status`,`ba_comment_status`,`ba_hits`,`ba_information`,`ba_recommended`,`ba_is_recycle`) values (2,'钝角','http://127.0.0.1:99/img/ba_img/966f8cbe8db395b1ab281d4bce5e9c82.png',41,'','不该了',1652873573,0,1,0,0,0,0),(3,'王者荣耀','http://127.0.0.1:99/img/ba_img/011c61d79319a565ab85ddd3c3ede802.jpg',41,'','全球首款5V5英雄公平对战手游',1652873573,0,1,0,0,0,0),(4,'lol陪玩吧','http://127.0.0.1:99/img/ba_img/b2ef23b7b31ded404e549533a7dc3465.jpg',42,'','全网妹子最多，高手最多的贴吧',1652873573,0,1,0,0,0,0),(5,'明日方舟','http://127.0.0.1:99/img/ba_img/d41d4fbc724f81fb09613e432489526e.webp',42,'','明日方舟介绍',1650873573,0,1,0,0,0,0),(7,'逆战','http://127.0.0.1:99/img/ba_img/d41d4fbc724f81fb09613e432489526e.webp',43,'','你你你你您',0,0,1,0,0,0,0),(9,'jiji','http://127.0.0.1:99/img/users_img/default.jpeg',44,'','',0,0,1,0,0,0,0),(10,'测试添加加加加','http://127.0.0.1:99/img/ba_img/2bac15def55d50e8fa3701f3dd3e210d.jpg',45,'','ceshi1221',1655003971,0,1,0,0,0,0),(11,'笔记','http://127.0.0.1:99/img/users_img/default.jpeg',42,'','笔记记录',1655005671,0,1,0,0,0,0),(12,'无敌是多么寂寞','http://127.0.0.1:99/img/users_img/default.jpeg',42,'','',1655006274,0,1,0,0,0,0),(13,'123','http://127.0.0.1:99/img/users_img/default.jpeg',41,'','',1655007183,0,1,0,0,0,0),(14,'wowowo','http://127.0.0.1:99/img/users_img/default.jpeg',44,'','',1655007568,0,1,0,0,0,0),(15,'12345678','http://127.0.0.1:99/img/users_img/default.jpeg',41,'','',1655277177,0,1,0,0,0,0);

/*Table structure for table `dj_content` */

DROP TABLE IF EXISTS `dj_content`;

CREATE TABLE `dj_content` (
  `co_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主帖子id',
  `co_floor_sum` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '从贴楼层数',
  `co_title` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '帖子标题',
  `co_content` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '帖子内容',
  `co_ba_id` int NOT NULL COMMENT '贴吧归属的id',
  `co_user_id` int NOT NULL COMMENT '发布者的ID',
  `co_img` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '帖子图片路径',
  `co_add_time` int unsigned NOT NULL COMMENT '帖子添加时间',
  `co_comment_num` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '从贴总数',
  `co_collect` char(16) NOT NULL DEFAULT '0' COMMENT '收藏总数',
  `co_praise` char(16) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '点赞总数',
  `co_comment_status` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '是否允许评论 1：允许 0：不允许',
  `co_status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '0:未审核 1：已审核',
  `co_update_time` int unsigned NOT NULL DEFAULT '0' COMMENT '帖子更新时间',
  `co_hits` int unsigned NOT NULL DEFAULT '0' COMMENT '点击数（查看数）',
  `co_is_top` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否置顶 1：置顶 0：不置顶',
  `co_essence` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否加精 1：加精 0：不加精',
  `co_is_recycle` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '是否回收 1：回收  0：不回收',
  PRIMARY KEY (`co_id`),
  KEY `fk_cp_article_cp_users1_idx` (`co_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8mb3 COMMENT='文章表';

/*Data for the table `dj_content` */

insert  into `dj_content`(`co_id`,`co_floor_sum`,`co_title`,`co_content`,`co_ba_id`,`co_user_id`,`co_img`,`co_add_time`,`co_comment_num`,`co_collect`,`co_praise`,`co_comment_status`,`co_status`,`co_update_time`,`co_hits`,`co_is_top`,`co_essence`,`co_is_recycle`) values (90,'7','英格兰国家队为什么总是拉胯','听起来似乎也是和法国德国一样的豪门 阵容每次都不错球星也很多 但是每次看他阵容再好也不是夺冠大热 一般都排在5—6位 德国阿根廷西班牙阵容不好的时候也感觉德国阿根廷西班牙能冲击冠军 一提到英格兰阵容再好也感觉他会拉胯',2,41,'',1655291236,'0','0','0',1,0,0,0,0,0,0),(91,'0','骡子的成功之处就在于在国内营销所谓绝代双骄！！！','骡子自出道以来一路各种蹭，先是蹭大罗小罗，搞个小小骡。。后期转会皇马，拿到欧冠就开始蹭梅西，一路蹭到现在，现在提到梅西就是骡子，甩都甩不掉！！梅西从来对标的都是马拉多纳贝利等人，也许拿到世界杯可能超过他们，但现在也是前三的存在！！骡子呢？？就一个饼锋，对标的应该是盖德穆勒！现在天天营销搞的好像除了梅西就是骡子了！！生生把骡子档次提高了',2,41,'',1655291448,'0','0','0',1,0,0,0,0,0,0),(96,'0','input按键点击','笔记',11,45,'http://127.0.0.1:99/img/content_img/29a259b1dd495ac660aa54f187915be4.png',1655351998,'0','0','0',1,0,0,0,0,0,0),(97,'0','测试四个图片','123',14,45,'http://127.0.0.1:99/img/content_img/f06dfa16028d59a855742c7243117ff0.png,http://127.0.0.1:99/img/content_img/d3104e09d3a0a1e67d13b3ab26437b8a.png,http://127.0.0.1:99/img/content_img/d58e32d0ac095bc5e583105e51a02771.png,http://127.0.0.1:99/img/content_img/01f23013d1538130262f16028c9ec757.png',1655352203,'0','0','0',1,0,0,0,0,0,0),(99,'5','关于孙尚香的理解','我什么位置都玩，我感觉孙尚香是版本强势射手里面最好切的一个，为什么还有挺多人说孙尚香容错率很高啊，你是拿孙尚香跟后羿伽罗做对比吗，马可狄仁杰李元芳容错率拉了孙尚香几条街吧，真的很好奇，你玩什么英雄会觉得孙尚香这种英雄的容错率很高。',3,42,'http://127.0.0.1:99/img/content_img/7320a773f152e1458809389d737c43e9.jpg',1655352888,'0','0','0',1,0,0,0,0,0,0),(100,'4','怎么才算厉害呢','总是因为追求游戏数据丢了好多朋友\n但是好像一直陪着我的只有游戏了',3,44,'http://127.0.0.1:99/img/content_img/efe3782e89c8489c52c8aab937acf761.jpg',1655365383,'0','0','0',1,0,0,0,0,0,0),(101,'4','关于elo机制','谁再说elo机制是自己不够厉害的给我站出来\n战绩图是青铜局\n选了两把比较有代表性的\n是都是炸鱼 但对面是会思考的鱼 你家就真的是鱼\n以此现象说明往上段位，对面也菜但就是比你队友会动脑子\n一打五是赢不了的',3,45,'http://127.0.0.1:99/img/content_img/7a491ce59566d0a3947daf7aa2c87aec.jpg,http://127.0.0.1:99/img/content_img/e8460e70e28865a1b124515da36daf7d.jpg,http://127.0.0.1:99/img/content_img/35cd2dd2bbe1547862866f5dff0813be.jpg',1655365513,'0','0','0',1,0,0,0,0,0,0),(102,'2','兄弟们进来告诉我到底要不要买李逍遥啊','这几天真的犹豫死了，不知道该不该买李逍遥，确实有点喜欢，但是好久没有充钱了，又觉得有点不值，兄弟们给点建议好吗。',3,41,'',1655366745,'0','0','0',1,0,0,0,0,0,0),(103,'12','白银来个双排','  ',4,41,'',1655367232,'0','0','0',1,0,0,0,0,0,0);

/*Table structure for table `dj_role` */

DROP TABLE IF EXISTS `dj_role`;

CREATE TABLE `dj_role` (
  `role_id` smallint unsigned NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '角色名称',
  `role_rids` varchar(512) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '权限ids,1,2,5',
  `role_desc` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '角色描述',
  `role_status` tinyint NOT NULL DEFAULT '1' COMMENT 'status 状态：为1正常，为0禁用',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;

/*Data for the table `dj_role` */

insert  into `dj_role`(`role_id`,`role_name`,`role_rids`,`role_desc`,`role_status`) values (0,'超级管理员','',NULL,1),(1,'普通用户','',NULL,1);

/*Table structure for table `dj_users` */

DROP TABLE IF EXISTS `dj_users`;

CREATE TABLE `dj_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uname` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '用户名',
  `upassword` char(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `nickname` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `u_email` varchar(60) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '邮箱',
  `face` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'http://127.0.0.1:99/img/users_img/default.jpeg' COMMENT '用户头像',
  `sex` enum('男','女') CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '男' COMMENT '性别',
  `signature` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '个性签名',
  `add_time` int NOT NULL DEFAULT '0' COMMENT '注册时间',
  `history_Record` varchar(1024) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT '' COMMENT '查看主贴的历史记录',
  `user_type` tinyint NOT NULL DEFAULT '1' COMMENT '权限0:管理1：普通',
  `ustate` int DEFAULT '0' COMMENT '是否登录状态0：登录1：退出',
  `is_black` tinyint DEFAULT '0' COMMENT '是否封禁 0：正常,1：封禁',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb3 COMMENT='用户表';

/*Data for the table `dj_users` */

insert  into `dj_users`(`id`,`uname`,`upassword`,`nickname`,`u_email`,`face`,`sex`,`signature`,`add_time`,`history_Record`,`user_type`,`ustate`,`is_black`) values (41,'zhangsan','$2a$10$yBfatXEldT/wS5cRpgGriuGHXcl6Lhr9s4QellezvLe.hk7C5PAJe','大哥22','111111111@qq.com','http://127.0.0.1:99/img/users_img/0f42e1da23b45191d618e0db70637cbb.jpeg','男','00',1652873410,'95,101,90,99,100,91,102,103',0,1,0),(42,'erdi','$2a$10$OjR0rBfru41ziHvA7BgH3.PHCPvamUjI/Fk7doZPAJfOpZEF9IZ6q','二弟·改2','2418004561@qq.com','http://127.0.0.1:99/img/users_img/417379bb1c243bf318e24f072d3d1f20.jpg','女','asdasd',1652873573,'',1,0,0),(43,'sandi','$2a$10$88cndg7OD/TKMvTgHL2OJ.VlkCgX7xz5.RAPYiEg//zy8TrUZJWYy','三弟·改3','13736724206@163.com','http://127.0.0.1:99/img/users_img/7cae6a797e4d3ed7b42b4dc12c6339dc.png','男','你好11',1652874914,'',1,0,0),(44,'erguo','$2a$10$MqwbCBxjt0DC9N0N/bWboOAGnD8oUEKsJzn8.8oKc9t.tNAjnNbO2','四弟','2418004561@qq.com','http://127.0.0.1:99/img/users_img/3a8afb3bb871052e3aa022ea27807ce2.jpeg','男','123',1652875062,'',1,0,1),(45,'lisi','$2a$10$lybdSiaZv.hg2Cj0D.VmFOGCIjbsmyBZvxpWCRORReRREKnhyoP.y','五弟','13736724206@163.com','http://127.0.0.1:99/img/users_img/311e6488adc95cb4675a9719fdc75670.webp','男','',1653139741,'96,91,90,97,98,99,100,101',1,0,0),(61,'www','$2a$10$HmxNYrNYCzv5G4hOk2mU1.3W0Tswct6SrLJB0P1gqY6bgyDGLO0Gq','www','','http://127.0.0.1:99/img/users_img/default.jpeg','男','',1655289798,'',1,0,0),(62,'mmm','$2a$10$aCiQlkXH3HlAEEBobMZa0uq1l.8IOtIg8P.vaNAjNHrBM9gD5qVVW','','','http://127.0.0.1:99/img/users_img/default.jpeg','男','',1655289828,'',1,0,0);

/*Table structure for table `home_banner` */

DROP TABLE IF EXISTS `home_banner`;

CREATE TABLE `home_banner` (
  `hb_id` int NOT NULL AUTO_INCREMENT,
  `hb_imgUrl` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '轮播图',
  `hb_hrefUrl` varchar(256) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '/' COMMENT '轮播图跳转链接',
  PRIMARY KEY (`hb_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

/*Data for the table `home_banner` */

insert  into `home_banner`(`hb_id`,`hb_imgUrl`,`hb_hrefUrl`) values (1,'http://127.0.0.1:99/img/home_banner/banner_1.png','/bas/item/5'),(2,'http://127.0.0.1:99/img/home_banner/22e4e6f7922a6c2d8bbc3c033300b462.png','/'),(3,'http://127.0.0.1:99/img/home_banner/banner_3.png','/'),(4,'http://127.0.0.1:99/img/home_banner/banner_4.png','/'),(5,'http://127.0.0.1:99/img/home_banner/banner_5.png','/');

/*Table structure for table `user_fan` */

DROP TABLE IF EXISTS `user_fan`;

CREATE TABLE `user_fan` (
  `fa_id` int NOT NULL AUTO_INCREMENT,
  `fa_user_id` int NOT NULL COMMENT '被关注人',
  `fa_ruser_id` int NOT NULL COMMENT '关注人',
  PRIMARY KEY (`fa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb3;

/*Data for the table `user_fan` */

insert  into `user_fan`(`fa_id`,`fa_user_id`,`fa_ruser_id`) values (1,41,42),(15,41,43),(31,43,41),(32,42,41);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
