/*
 Navicat Premium Data Transfer

 Source Server         : db
 Source Server Type    : MySQL
 Source Server Version : 80028 (8.0.28)
 Source Host           : localhost:3306
 Source Schema         : acg_mall

 Target Server Type    : MySQL
 Target Server Version : 80028 (8.0.28)
 File Encoding         : 65001

 Date: 29/08/2026 23:45:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for address
-- ----------------------------
DROP TABLE IF EXISTS `address`;
CREATE TABLE `address`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `receiver_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '收货人',
  `receiver_phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '收货人电话',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '省',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '市',
  `district` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '区/县',
  `detail` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '详细地址',
  `is_default` tinyint NOT NULL DEFAULT 0 COMMENT '0-否 1-默认地址',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_user`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '收货地址表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of address
-- ----------------------------
INSERT INTO `address` VALUES (1, 1, '张小樱', '13800138001', '浙江省', '杭州市', '西湖区', '文三路123号幸福小区5栋301', 1, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `address` VALUES (2, 1, '张小樱', '13800138001', '浙江省', '杭州市', '余杭区', '良渚街道梦想小镇创业园B栋1201', 0, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `address` VALUES (3, 2, '李航', '13800138002', '广东省', '深圳市', '南山区', '科技园南区深圳湾1号T7栋9层', 1, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `address` VALUES (4, 2, '李航', '13800138002', '广东省', '广州市', '天河区', '天河路385号太古汇裙楼2层', 0, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `address` VALUES (5, 3, '王收藏', '13800138003', '上海市', '上海市', '浦东新区', '陆家嘴环路1000号恒生银行大厦20层', 1, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `address` VALUES (6, 4, '陈诗雨', '13800138004', '北京市', '北京市', '朝阳区', '三里屯太古里南区3层S3-30b', 1, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `address` VALUES (7, 4, '陈诗雨', '13800138004', '北京市', '北京市', '海淀区', '中关村大街15号中关村广场D座5层', 0, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `address` VALUES (8, 5, '刘追番', '13800138005', '四川省', '成都市', '武侯区', '天府大道北段1700号环球中心W3栋', 1, '2026-03-21 11:11:54', '2026-03-21 11:11:54');

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录用户名',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录密码（明文）',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '昵称',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `role` tinyint NOT NULL DEFAULT 1 COMMENT '1-超级管理员 2-普通管理员',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0-禁用 1-启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, 'admin', 'admin123', '超级管理员', '/api/uploads/avatar-admin.png', 1, 1, '2026-03-21 11:11:54', '2026-08-29 16:03:04');
INSERT INTO `admin` VALUES (2, 'manager', 'manager123', '运营管理员', '/api/uploads/avatar-manager.png', 2, 1, '2026-03-21 11:11:54', '2026-08-29 16:03:04');

-- ----------------------------
-- Table structure for announcement
-- ----------------------------
DROP TABLE IF EXISTS `announcement`;
CREATE TABLE `announcement`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告正文',
  `admin_id` int NOT NULL COMMENT '发布管理员ID',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0-下线 1-发布中',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统公告表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of announcement
-- ----------------------------
INSERT INTO `announcement` VALUES (1, '欢迎来到ACG周边商城！', '亲爱的二次元小伙伴们，欢迎来到ACG周边商城！\n\n我们专注为ACG爱好者提供正版、高品质的动漫周边商品，涵盖手办模型、服饰、文具、毛绒玩偶、海报挂画、徽章挂件等六大品类。\n\n新用户注册即享首单九折优惠，快来挑选你心仪的二次元好物吧！如有任何问题，欢迎联系在线客服。\n\n祝购物愉快！', 1, 1, '2025-01-01 00:00:00', '2026-03-21 11:11:54');
INSERT INTO `announcement` VALUES (2, '三月春季大促活动来袭！', '春暖花开，ACG周边商城三月大促正式开始！\n\n活动时间：2025年3月1日 - 3月31日\n\n活动内容：\n1. 全场手办模型满300减30\n2. 服饰周边第二件半价\n3. 文具文创买三送一\n4. 毛绒玩偶专区限时8折\n5. 消费满500元赠限定徽章一枚\n\n优惠不可叠加使用，最终解释权归本商城所有。快来把心仪的周边带回家吧！', 1, 1, '2025-03-01 00:00:00', '2026-03-21 11:11:54');
INSERT INTO `announcement` VALUES (3, '原神新品上架通知', '各位旅行者好！\n\n我们刚刚上架了一批原神最新周边商品：\n- 可莉 蹦蹦炸弹 1/7比例精品手办（限量版）\n- 七元素神之眼挂件钥匙扣套装\n- 更多角色周边正在进货中...\n\n所有原神新品首发期间享9折优惠，库存有限，先到先得！\n\n后续还会陆续上架纳西妲、钟离等热门角色周边，敬请期待～', 2, 1, '2025-03-10 10:00:00', '2026-03-21 11:11:54');
INSERT INTO `announcement` VALUES (4, '物流配送与售后服务说明', '尊敬的用户：\n\n为了让您有更好的购物体验，现将物流与售后政策说明如下：\n\n【物流配送】\n- 下单后1-2个工作日内发货（预售商品除外）\n- 默认韵达/中通快递，手办类商品默认顺丰\n- 全国包邮（港澳台及海外地区暂不支持）\n\n【售后政策】\n- 签收后7天内支持无理由退货（不影响二次销售）\n- 商品质量问题支持15天换货\n- 手办模型类商品拆封后不支持退货，请谅解\n\n如有疑问请联系在线客服，工作时间 9:00-21:00。', 2, 1, '2025-02-15 09:00:00', '2026-03-21 11:11:54');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `product_id` int NOT NULL COMMENT '商品ID',
  `quantity` int NOT NULL DEFAULT 1 COMMENT '数量',
  `selected` tinyint NOT NULL DEFAULT 1 COMMENT '0-未勾选 1-已勾选',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user_product`(`user_id` ASC, `product_id` ASC) USING BTREE,
  INDEX `idx_user`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '购物车表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES (4, 4, 9, 1, 1, '2026-03-21 11:11:54', '2026-03-21 11:11:54');
INSERT INTO `cart` VALUES (5, 4, 11, 3, 0, '2026-03-21 11:11:54', '2026-03-21 11:11:54');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类名称',
  `icon` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类图标',
  `sort_order` int NOT NULL DEFAULT 0 COMMENT '排序权重，越小越靠前',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0-禁用 1-启用',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商品分类表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '手办模型', '/api/uploads/category-figure.png', 1, 1, '2026-03-21 11:11:54');
INSERT INTO `category` VALUES (2, '服饰周边', '/api/uploads/category-apparel.png', 2, 1, '2026-03-21 11:11:54');
INSERT INTO `category` VALUES (3, '文具文创', '/api/uploads/category-stationery.png', 3, 1, '2026-03-21 11:11:54');
INSERT INTO `category` VALUES (4, '毛绒玩偶', '/api/uploads/category-plush.png', 4, 1, '2026-03-21 11:11:54');
INSERT INTO `category` VALUES (5, '海报挂画', '/api/uploads/category-poster.png', 5, 1, '2026-03-21 11:11:54');
INSERT INTO `category` VALUES (6, '徽章挂件', '/api/uploads/category-accessories.png', 6, 1, '2026-03-21 11:11:54');

-- ----------------------------
-- Table structure for chat_message
-- ----------------------------
DROP TABLE IF EXISTS `chat_message`;
CREATE TABLE `chat_message`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL COMMENT '会话ID',
  `sender_type` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'user/admin',
  `sender_id` int NOT NULL COMMENT '发送者ID',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '消息内容',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_session`(`session_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '客服消息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of chat_message
-- ----------------------------
INSERT INTO `chat_message` VALUES (1, 1, 'admin', 1, '您好，欢迎咨询 ACG 商城客服！请问有什么可以帮助您的？', '2026-03-20 10:00:00');
INSERT INTO `chat_message` VALUES (2, 1, 'user', 1, '你好，这款咒术回战钥匙扣还有货吗？', '2026-03-20 10:01:00');
INSERT INTO `chat_message` VALUES (3, 1, 'admin', 1, '您好，这款商品目前有现货，可以正常下单哦~', '2026-03-20 10:03:00');
INSERT INTO `chat_message` VALUES (4, 1, 'user', 1, '好的，那我下单了，发货快吗？', '2026-03-20 10:04:00');
INSERT INTO `chat_message` VALUES (5, 1, 'admin', 1, '好的，稍后为您查询库存情况', '2026-03-20 10:05:00');
INSERT INTO `chat_message` VALUES (6, 2, 'admin', 1, '您好，欢迎咨询 ACG 商城客服！请问有什么可以帮助您的？', '2026-08-29 17:58:03');
INSERT INTO `chat_message` VALUES (7, 2, 'user', 2, 'gds', '2026-08-29 17:58:08');
INSERT INTO `chat_message` VALUES (8, 2, 'user', 2, 'fwa', '2026-08-29 17:58:16');
INSERT INTO `chat_message` VALUES (9, 2, 'user', 2, '1', '2026-08-29 18:05:14');

-- ----------------------------
-- Table structure for chat_session
-- ----------------------------
DROP TABLE IF EXISTS `chat_session`;
CREATE TABLE `chat_session`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `product_id` int NULL DEFAULT NULL COMMENT '关联商品ID',
  `product_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '关联商品名称',
  `last_message` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '最后一条消息',
  `unread_user` int NOT NULL DEFAULT 0 COMMENT '用户未读数',
  `unread_admin` int NOT NULL DEFAULT 0 COMMENT '客服未读数',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_user`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '客服会话表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of chat_session
-- ----------------------------
INSERT INTO `chat_session` VALUES (1, 1, 15, '咒术回战 领域展开亚克力钥匙扣', '好的，稍后为您查询库存情况', 0, 0, '2026-03-20 10:00:00', '2026-03-20 10:05:00');
INSERT INTO `chat_session` VALUES (2, 2, 6, '咒术回战 五条悟无量空处短袖T恤', '1', 0, 1, '2026-08-29 17:58:03', '2026-08-29 18:05:14');

-- ----------------------------
-- Table structure for order_item
-- ----------------------------
DROP TABLE IF EXISTS `order_item`;
CREATE TABLE `order_item`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL COMMENT '订单ID',
  `product_id` int NOT NULL COMMENT '商品ID',
  `product_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品名称快照',
  `product_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品图片快照',
  `price` decimal(10, 2) NOT NULL COMMENT '成交单价',
  `quantity` int NOT NULL COMMENT '购买数量',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_order`(`order_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '订单明细表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of order_item
-- ----------------------------
INSERT INTO `order_item` VALUES (1, 1, 1, '海贼王 路飞五档尼卡形态手办', '/api/uploads/product-01-pirate-figure.png', 299.00, 1);
INSERT INTO `order_item` VALUES (2, 1, 13, '鬼灭之刃 九柱合集金属徽章套装', '/api/uploads/product-13-metal-pin-set.png', 35.00, 1);
INSERT INTO `order_item` VALUES (3, 2, 9, '宝可梦 皮卡丘毛绒公仔 30cm', '/api/uploads/product-09-yellow-rabbit-plush.png', 79.00, 1);
INSERT INTO `order_item` VALUES (4, 2, 6, '咒术回战 五条悟无量空处短袖T恤', '/api/uploads/product-06-cosmic-tshirt.png', 89.00, 1);
INSERT INTO `order_item` VALUES (5, 3, 3, '原神 可莉蹦蹦炸弹 1/7比例手办', '/api/uploads/product-03-red-hood-figure.png', 459.00, 1);
INSERT INTO `order_item` VALUES (6, 3, 14, '原神 七元素神之眼挂件钥匙扣', '/api/uploads/product-14-elemental-keychains.png', 25.00, 2);
INSERT INTO `order_item` VALUES (7, 4, 1, '海贼王 路飞五档尼卡形态手办', '/api/uploads/product-01-pirate-figure.png', 299.00, 1);
INSERT INTO `order_item` VALUES (8, 4, 9, '宝可梦 皮卡丘毛绒公仔 30cm', '/api/uploads/product-09-yellow-rabbit-plush.png', 79.00, 1);
INSERT INTO `order_item` VALUES (9, 4, 7, '间谍过家家 阿尼亚哇库哇库笔记本套装', '/api/uploads/product-07-notebook-set.png', 39.00, 1);
INSERT INTO `order_item` VALUES (10, 5, 1, '海贼王 路飞五档尼卡形态手办', '/api/uploads/product-01-pirate-figure.png', 299.00, 1);
INSERT INTO `order_item` VALUES (11, 5, 15, '咒术回战 领域展开亚克力钥匙扣', '/api/uploads/product-15-acrylic-keychains.png', 19.00, 1);
INSERT INTO `order_item` VALUES (12, 5, 6, '咒术回战 五条悟无量空处短袖T恤', '/api/uploads/product-06-cosmic-tshirt.png', 89.00, 1);
INSERT INTO `order_item` VALUES (13, 6, 10, '龙猫 大号毛绒抱枕 50cm', '/api/uploads/product-10-forest-plush-cushion.png', 129.00, 1);
INSERT INTO `order_item` VALUES (14, 6, 12, '千与千寻 宫崎骏复古风装饰画', '/api/uploads/product-12-fantasy-art-print.png', 49.00, 1);
INSERT INTO `order_item` VALUES (15, 7, 5, '进击的巨人 调查兵团自由之翼连帽卫衣', '/api/uploads/product-05-wing-hoodie.png', 169.00, 1);
INSERT INTO `order_item` VALUES (16, 7, 11, '你的名字 新海诚电影高清海报', '/api/uploads/product-11-twilight-art-poster.png', 29.00, 1);
INSERT INTO `order_item` VALUES (17, 8, 9, '宝可梦 皮卡丘毛绒公仔 30cm', '/api/uploads/product-09-yellow-rabbit-plush.png', 79.00, 1);
INSERT INTO `order_item` VALUES (18, 8, 15, '咒术回战 领域展开亚克力钥匙扣', '/api/uploads/product-15-acrylic-keychains.png', 19.00, 2);
INSERT INTO `order_item` VALUES (19, 9, 4, '火影忍者 漩涡鸣人仙人模式手办', '/api/uploads/product-04-ninja-figure.png', 259.00, 1);
INSERT INTO `order_item` VALUES (20, 10, 3, '原神 可莉蹦蹦炸弹 1/7比例手办', '/api/uploads/product-03-red-hood-figure.png', 459.00, 1);
INSERT INTO `order_item` VALUES (21, 10, 14, '原神 七元素神之眼挂件钥匙扣', '/api/uploads/product-14-elemental-keychains.png', 25.00, 2);
INSERT INTO `order_item` VALUES (22, 10, 15, '咒术回战 领域展开亚克力钥匙扣', '/api/uploads/product-15-acrylic-keychains.png', 19.00, 1);
INSERT INTO `order_item` VALUES (23, 11, 13, '鬼灭之刃 九柱合集金属徽章套装', '/api/uploads/product-13-metal-pin-set.png', 35.00, 1);
INSERT INTO `order_item` VALUES (24, 12, 5, '进击的巨人 调查兵团自由之翼连帽卫衣', '/api/uploads/product-05-wing-hoodie.png', 169.00, 1);
INSERT INTO `order_item` VALUES (25, 12, 6, '咒术回战 五条悟无量空处短袖T恤', '/api/uploads/product-06-cosmic-tshirt.png', 89.00, 2);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_no` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '订单编号',
  `user_id` int NOT NULL COMMENT '用户ID',
  `receiver_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '收货人',
  `receiver_phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '收货人电话',
  `receiver_address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '收货地址快照',
  `total_amount` decimal(10, 2) NOT NULL COMMENT '订单总金额',
  `pay_amount` decimal(10, 2) NOT NULL COMMENT '实付金额',
  `status` tinyint NOT NULL DEFAULT 0 COMMENT '0-待付款 1-待发货 2-待收货 3-已完成 4-已取消',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '买家备注',
  `pay_time` datetime NULL DEFAULT NULL COMMENT '支付时间',
  `ship_time` datetime NULL DEFAULT NULL COMMENT '发货时间',
  `receive_time` datetime NULL DEFAULT NULL COMMENT '确认收货时间',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_user`(`user_id` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_order_no`(`order_no` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (1, '20250301000001', 1, '张小樱', '13800138001', '浙江省杭州市西湖区文三路123号幸福小区5栋301', 334.00, 334.00, 3, '请用气泡膜多包一层', '2025-03-01 14:31:00', '2025-03-02 09:00:00', '2025-03-05 16:20:00', '2025-03-01 14:30:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (2, '20250302000001', 2, '李航', '13800138002', '广东省深圳市南山区科技园南区深圳湾1号T7栋9层', 168.00, 168.00, 3, NULL, '2025-03-02 10:16:00', '2025-03-03 08:30:00', '2025-03-06 11:45:00', '2025-03-02 10:15:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (3, '20250303000001', 3, '王收藏', '13800138003', '上海市上海市浦东新区陆家嘴环路1000号恒生银行大厦20层', 509.00, 509.00, 3, '发顺丰', '2025-03-03 20:01:00', '2025-03-04 10:00:00', '2025-03-07 14:30:00', '2025-03-03 20:00:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (4, '20250305000001', 4, '陈诗雨', '13800138004', '北京市北京市朝阳区三里屯太古里南区3层S3-30b', 417.00, 417.00, 3, NULL, '2025-03-05 09:31:00', '2025-03-06 08:00:00', '2025-03-09 15:00:00', '2025-03-05 09:30:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (5, '20250306000001', 5, '刘追番', '13800138005', '四川省成都市武侯区天府大道北段1700号环球中心W3栋', 407.00, 407.00, 3, '周末再配送', '2025-03-06 18:46:00', '2025-03-07 09:30:00', '2025-03-10 12:00:00', '2025-03-06 18:45:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (6, '20250310000001', 1, '张小樱', '13800138001', '浙江省杭州市西湖区文三路123号幸福小区5栋301', 178.00, 178.00, 2, NULL, '2025-03-10 16:21:00', '2025-03-11 09:00:00', NULL, '2025-03-10 16:20:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (7, '20250312000001', 4, '陈诗雨', '13800138004', '北京市北京市朝阳区三里屯太古里南区3层S3-30b', 198.00, 198.00, 1, '希望尽快发货', '2025-03-12 11:01:00', NULL, NULL, '2025-03-12 11:00:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (8, '20250313000001', 3, '王收藏', '13800138003', '上海市上海市浦东新区陆家嘴环路1000号恒生银行大厦20层', 117.00, 117.00, 0, NULL, NULL, NULL, NULL, '2025-03-13 21:30:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (9, '20250304000001', 2, '李航', '13800138002', '广东省深圳市南山区科技园南区深圳湾1号T7栋9层', 259.00, 259.00, 4, NULL, NULL, NULL, NULL, '2025-03-04 15:00:00', '2026-03-21 11:11:54');
INSERT INTO `orders` VALUES (10, '20260321112503537919', 1, '张小樱', '13800138001', '浙江省杭州市西湖区文三路123号幸福小区5栋301', 528.00, 528.00, 3, 'zzz', '2026-03-21 11:25:13', '2026-03-21 11:27:45', '2026-03-21 12:12:43', '2026-03-21 11:25:04', '2026-03-21 11:25:03');
INSERT INTO `orders` VALUES (11, '20260321121235365773', 1, '张小樱', '13800138001', '浙江省杭州市西湖区文三路123号幸福小区5栋301', 35.00, 35.00, 3, '', '2026-03-21 12:12:40', '2026-03-21 12:12:51', '2026-03-21 12:12:59', '2026-03-21 12:12:36', '2026-03-21 12:12:35');
INSERT INTO `orders` VALUES (12, '20260829180522509380', 2, '李航', '13800138002', '广东省深圳市南山区科技园南区深圳湾1号T7栋9层', 347.00, 347.00, 1, '', '2026-08-29 18:05:27', NULL, NULL, '2026-08-29 18:05:23', '2026-08-29 18:05:22');

-- ----------------------------
-- Table structure for product
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL COMMENT '分类ID',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品名称',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '商品详情描述',
  `price` decimal(10, 2) NOT NULL COMMENT '售价',
  `original_price` decimal(10, 2) NULL DEFAULT NULL COMMENT '原价（划线价）',
  `stock` int NOT NULL DEFAULT 0 COMMENT '库存',
  `sales` int NOT NULL DEFAULT 0 COMMENT '累计销量',
  `main_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品主图',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '商品轮播图（JSON 数组）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0-下架 1-上架',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_category`(`category_id` ASC) USING BTREE,
  INDEX `idx_status_sales`(`status` ASC, `sales` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of product
-- ----------------------------
INSERT INTO `product` VALUES (1, 1, '海贼王 路飞五档尼卡形态手办', '海贼王路飞Gear5尼卡形态景品手办，高约17cm，PVC材质，底座附带特效配件，完美还原动画名场面。适合海贼迷与手办收藏爱好者。', 299.00, 399.00, 200, 856, '/api/uploads/product-01-pirate-figure.png', '[\"/api/uploads/product-01-pirate-figure.png\"]', 1, '2025-01-10 08:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (2, 1, '鬼灭之刃 灶门炭治郎日轮刀景品手办', '鬼灭之刃炭治郎手持日轮刀战斗姿态手办，高约16cm，ABS+PVC材质，水之呼吸特效底座，涂装精细。', 199.00, 259.00, 150, 623, '/api/uploads/product-02-swordsman-figure.png', '[\"/api/uploads/product-02-swordsman-figure.png\"]', 1, '2025-01-10 08:30:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (3, 1, '原神 可莉蹦蹦炸弹 1/7比例手办', '原神可莉1/7比例精品手办，高约21cm，附带蹦蹦炸弹与书本配件，还原角色标志性站姿，限量版收藏级品质。', 459.00, 599.00, 79, 413, '/api/uploads/product-03-red-hood-figure.png', '[\"/api/uploads/product-03-red-hood-figure.png\"]', 1, '2025-01-15 10:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (4, 1, '火影忍者 漩涡鸣人仙人模式手办', '火影忍者鸣人仙人模式手办，高约18cm，搭配螺旋丸特效件，经典忍者造型完美呈现。', 259.00, 329.00, 120, 534, '/api/uploads/product-04-ninja-figure.png', '[\"/api/uploads/product-04-ninja-figure.png\"]', 1, '2025-01-20 09:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (5, 2, '进击的巨人 调查兵团自由之翼连帽卫衣', '进击的巨人联名卫衣，背部大面积自由之翼印花，320g加厚纯棉面料，宽松版型，秋冬必备。尺码：S/M/L/XL/XXL。', 169.00, 219.00, 299, 1206, '/api/uploads/product-05-wing-hoodie.png', '[\"/api/uploads/product-05-wing-hoodie.png\"]', 1, '2025-01-25 11:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (6, 2, '咒术回战 五条悟无量空处短袖T恤', '咒术回战五条悟角色T恤，正面无量空处领域展开图案，200g精梳棉圆领短袖，透气舒适。尺码：S/M/L/XL。', 89.00, 129.00, 498, 2343, '/api/uploads/product-06-cosmic-tshirt.png', '[\"/api/uploads/product-06-cosmic-tshirt.png\"]', 1, '2025-02-01 08:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (7, 3, '间谍过家家 阿尼亚哇库哇库笔记本套装', '间谍过家家阿尼亚主题笔记本3本装，A5尺寸，含横线本/空白本/方格本各1，附赠阿尼亚贴纸1张。封面烫金工艺。', 39.00, 49.00, 600, 1876, '/api/uploads/product-07-notebook-set.png', '[\"/api/uploads/product-07-notebook-set.png\"]', 1, '2025-02-05 14:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (8, 3, '龙珠 超级赛亚人文具礼盒套装', '龙珠主题文具礼盒，含自动铅笔×2、中性笔×3、橡皮×1、尺子×1、笔袋×1。悟空超赛变身系列图案，送礼自用两相宜。', 59.00, 79.00, 400, 987, '/api/uploads/product-08-stationery-box.png', '[\"/api/uploads/product-08-stationery-box.png\"]', 1, '2025-02-10 10:30:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (9, 4, '宝可梦 皮卡丘毛绒公仔 30cm', '正版宝可梦皮卡丘毛绒玩偶，高约30cm，A级短毛绒面料，PP棉填充，手感蓬松柔软。萌趣造型，送女友/闺蜜首选。', 79.00, 99.00, 350, 3214, '/api/uploads/product-09-yellow-rabbit-plush.png', '[\"/api/uploads/product-09-yellow-rabbit-plush.png\"]', 1, '2025-02-14 09:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (10, 4, '龙猫 大号毛绒抱枕 50cm', '宫崎骏龙猫经典造型超大毛绒抱枕，50cm加大尺寸，水晶超柔面料，可拆洗内胆，午睡靠垫两用。', 129.00, 169.00, 200, 1567, '/api/uploads/product-10-forest-plush-cushion.png', '[\"/api/uploads/product-10-forest-plush-cushion.png\"]', 1, '2025-02-14 09:30:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (11, 5, '你的名字 新海诚电影高清海报', '新海诚《你的名字。》官方授权高清海报，尺寸42×60cm，铜版纸覆膜印刷，色彩鲜艳不褪色。附赠双面胶和卷筒包装。', 29.00, 39.00, 800, 4521, '/api/uploads/product-11-twilight-art-poster.png', '[\"/api/uploads/product-11-twilight-art-poster.png\"]', 1, '2025-02-20 08:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (12, 5, '千与千寻 宫崎骏复古风装饰画', '千与千寻经典场景复古风格装饰画，带框尺寸30×40cm，进口画芯+实木相框，即挂即用。适合卧室/书房/客厅装饰。', 49.00, 69.00, 500, 2876, '/api/uploads/product-12-fantasy-art-print.png', '[\"/api/uploads/product-12-fantasy-art-print.png\"]', 1, '2025-02-20 08:30:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (13, 6, '鬼灭之刃 九柱合集金属徽章套装', '鬼灭之刃九柱角色金属徽章套装（共9枚），直径4.4cm，锌合金材质，蝴蝶扣针设计，可别在书包/衣领。收藏盒包装。', 35.00, 45.00, 399, 2146, '/api/uploads/product-13-metal-pin-set.png', '[\"/api/uploads/product-13-metal-pin-set.png\"]', 1, '2025-02-25 10:00:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (14, 6, '原神 七元素神之眼挂件钥匙扣', '原神七种元素（火/水/冰/雷/风/岩/草）神之眼造型钥匙扣套装，亚克力+金属环，双面高清UV印刷，每套7个。', 25.00, 35.00, 598, 3569, '/api/uploads/product-14-elemental-keychains.png', '[\"/api/uploads/product-14-elemental-keychains.png\"]', 1, '2025-02-25 10:30:00', '2026-08-29 15:45:13');
INSERT INTO `product` VALUES (15, 6, '咒术回战 领域展开亚克力钥匙扣', '咒术回战领域展开系列亚克力钥匙扣，高约6cm，双面印刷，激光切割，附赠龙虾扣。五条悟/虎杖/伏黑可选。', 19.00, 25.00, 700, 4124, '/api/uploads/product-15-acrylic-keychains.png', '[\"/api/uploads/product-15-acrylic-keychains.png\"]', 1, '2025-03-01 09:00:00', '2026-08-29 18:04:28');

-- ----------------------------
-- Table structure for review
-- ----------------------------
DROP TABLE IF EXISTS `review`;
CREATE TABLE `review`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户ID',
  `product_id` int NOT NULL COMMENT '商品ID',
  `order_id` int NOT NULL COMMENT '订单ID',
  `rating` tinyint NOT NULL DEFAULT 5 COMMENT '评分 1-5',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '评价文字',
  `images` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '晒图（JSON 数组）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0-隐藏 1-显示',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_product`(`product_id` ASC) USING BTREE,
  INDEX `idx_user`(`user_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '商品评价表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of review
-- ----------------------------
INSERT INTO `review` VALUES (1, 1, 1, 1, 5, '做工非常精细，路飞的五档形态还原度超高！底座设计也很用心，自带尼卡笑容的特效件，摆在书桌上特别帅气。包装也很到位，完全没有磕碰。', '[\"/api/uploads/product-01-pirate-figure.png\"]', 1, '2025-03-06 10:00:00');
INSERT INTO `review` VALUES (2, 1, 13, 1, 4, '九柱角色都很还原，炎柱和水柱画得最好看。金属质感不错，颜色鲜艳。就是蝴蝶扣针稍微有点松，佩戴时需要注意。整体性价比很高！', NULL, 1, '2025-03-06 10:15:00');
INSERT INTO `review` VALUES (3, 2, 9, 2, 5, '皮卡丘太可爱了！手感超级柔软蓬松，面料很舒服不扎手。30cm大小正合适，放在工位上每天看到都开心。已经被同事种草，准备回购送人～', '[\"/api/uploads/product-09-yellow-rabbit-plush.png\"]', 1, '2025-03-07 14:30:00');
INSERT INTO `review` VALUES (4, 2, 6, 2, 4, 'T恤面料是精梳棉的，穿着很舒服透气。五条悟的无量空处印花很清晰，颜色正。就是尺码偏小一点，建议参考尺码表买大一号。洗了两次没掉色。', NULL, 1, '2025-03-07 14:45:00');
INSERT INTO `review` VALUES (5, 3, 3, 3, 5, '可莉的手办太精致了！1/7比例大小摆在展示柜里特别好看。蹦蹦炸弹配件的细节做得很好，头发的渐变色涂装完美。作为原神玩家，这是必入的收藏品。', '[\"/api/uploads/product-03-red-hood-figure.png\"]', 1, '2025-03-08 09:00:00');
INSERT INTO `review` VALUES (6, 3, 14, 3, 3, '钥匙扣整体做工一般，七个元素的颜色对比游戏里有些偏差，雷元素偏黄了。亚克力材质还行，不容易断。不过这个价格来说性价比还算可以吧。', NULL, 1, '2025-03-08 09:20:00');
INSERT INTO `review` VALUES (7, 4, 1, 4, 4, '路飞手办整体造型很不错，五档的飘逸感做出来了。但底座和脚部的连接稍微有点松动，需要自己加固一下。涂装细节还是很到位的，给四星。', NULL, 1, '2025-03-10 11:00:00');
INSERT INTO `review` VALUES (8, 4, 9, 4, 5, '第二次买皮卡丘啦！这次是送给闺蜜的生日礼物，她拆开的时候超级开心！毛绒质量一如既往地好，皮卡丘永远滴神！下次准备入可达鸭。', '[\"/api/uploads/product-09-yellow-rabbit-plush.png\"]', 1, '2025-03-10 11:20:00');
INSERT INTO `review` VALUES (9, 4, 7, 4, 4, '阿尼亚的笔记本太可爱了！封面烫金工艺很有质感，纸张不洇墨，钢笔写上去也很流畅。就是淡色封面比较容易脏，建议加个透明书套保护。', NULL, 1, '2025-03-10 11:35:00');
INSERT INTO `review` VALUES (10, 5, 1, 5, 4, '作为海贼迷必入的手办！路飞五档尼卡造型太燃了，和漫画里一模一样。就是快递箱子有点小，手办盒子被挤压了一下，好在里面没事。希望包装再用心一点。', '[\"/api/uploads/product-01-pirate-figure.png\"]', 1, '2025-03-11 20:00:00');
INSERT INTO `review` VALUES (11, 5, 15, 5, 5, '亚克力材质很通透，领域展开的图案双面印刷都很清晰，颜色饱满。激光切割的边缘很光滑没有毛刺。挂在书包上超吸睛，已经有好几个人问我哪里买的了！', '[\"/api/uploads/product-15-acrylic-keychains.png\"]', 1, '2025-03-11 20:15:00');
INSERT INTO `review` VALUES (12, 5, 6, 5, 3, 'T恤图案还行，五条悟摘眼罩的图挺帅的。但穿了两周洗了几次后印花有轻微龟裂的迹象，不知道是不是水温太高了。面料舒适度倒是不错。建议商家改善印花工艺。', NULL, 1, '2025-03-11 20:30:00');
INSERT INTO `review` VALUES (13, 1, 13, 11, 4, 'ccc', NULL, 1, '2026-03-21 12:13:10');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '手机号（登录账号）',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录密码（明文）',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像',
  `gender` tinyint NULL DEFAULT 0 COMMENT '0-未知 1-男 2-女',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '0-注销 1-正常',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '13800138001', '123456', '樱花小丸子1', '/api/uploads/avatar-user-01.png', 0, '2000-03-15', 1, '2025-01-05 10:00:00', '2026-08-29 16:03:04');
INSERT INTO `user` VALUES (2, '13800138002', '123456', '路飞的草帽', '/api/uploads/avatar-user-02.png', 1, '1999-05-20', 1, '2025-01-10 14:30:00', '2026-08-29 16:03:04');
INSERT INTO `user` VALUES (3, '13800138003', '123456', '手办收藏家', '/api/uploads/avatar-user-03.png', 1, '2001-08-10', 1, '2025-01-15 09:20:00', '2026-08-29 16:03:04');
INSERT INTO `user` VALUES (4, '13800138004', '123456', '二次元少女', '/api/uploads/avatar-user-04.png', 2, '2002-12-25', 1, '2025-02-01 16:45:00', '2026-08-29 16:03:04');
INSERT INTO `user` VALUES (5, '13800138005', '123456', '追番达人', '/api/uploads/avatar-user-05.png', 1, '2000-07-07', 1, '2025-02-10 20:00:00', '2026-08-29 16:03:04');
INSERT INTO `user` VALUES (6, '19848382091', '123456', 'acg', NULL, 0, NULL, 1, '2026-08-29 16:06:27', '2026-08-29 16:06:27');

SET FOREIGN_KEY_CHECKS = 1;
