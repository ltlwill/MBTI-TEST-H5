-- ============================================================
-- MBTI 16型人格职业性格测试 - 数据库建表脚本
-- 适用于 MySQL 5.7+ / 8.0+
-- ============================================================

-- 1. 题目表
CREATE TABLE IF NOT EXISTS `mbti_question` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `question_no` INT NOT NULL COMMENT '题号 1-36',
  `dimension` CHAR(3) NOT NULL COMMENT '所属维度: E_I, S_N, T_F, J_P',
  `question_text` VARCHAR(500) NOT NULL COMMENT '题干文本',
  `option_a_text` VARCHAR(300) NOT NULL COMMENT '选项A文本',
  `option_b_text` VARCHAR(300) NOT NULL COMMENT '选项B文本',
  `option_a_pole` CHAR(1) NOT NULL COMMENT '选A对应的极性: E/S/T/J',
  `option_b_pole` CHAR(1) NOT NULL COMMENT '选B对应的极性: I/N/F/P',
  `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序权重',
  `status` TINYINT NOT NULL DEFAULT 1 COMMENT '启用状态: 1-启用 0-禁用',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_question_no` (`question_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MBTI测试题目表';

-- 2. 测试记录表
CREATE TABLE IF NOT EXISTS `mbti_test_record` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` BIGINT DEFAULT NULL COMMENT '用户ID（未登录为NULL）',
  `user_name` VARCHAR(50) NOT NULL COMMENT '用户姓名',
  `user_phone` VARCHAR(20) NOT NULL COMMENT '用户手机号',
  `session_id` VARCHAR(64) NOT NULL COMMENT '会话标识UUID',
  `result_type` CHAR(4) NOT NULL COMMENT '测试结果: INTJ/ENFP等',
  `score_e` INT NOT NULL DEFAULT 0 COMMENT 'E(外向)得分 0-9',
  `score_i` INT NOT NULL DEFAULT 0 COMMENT 'I(内向)得分 0-9',
  `score_s` INT NOT NULL DEFAULT 0 COMMENT 'S(实感)得分 0-9',
  `score_n` INT NOT NULL DEFAULT 0 COMMENT 'N(直觉)得分 0-9',
  `score_t` INT NOT NULL DEFAULT 0 COMMENT 'T(思考)得分 0-9',
  `score_f` INT NOT NULL DEFAULT 0 COMMENT 'F(情感)得分 0-9',
  `score_j` INT NOT NULL DEFAULT 0 COMMENT 'J(判断)得分 0-9',
  `score_p` INT NOT NULL DEFAULT 0 COMMENT 'P(感知)得分 0-9',
  `answers_json` TEXT NOT NULL COMMENT '完整答案JSON: [{"questionNo":1,"answer":"A"},...]',
  `duration_seconds` INT NOT NULL DEFAULT 0 COMMENT '答题耗时(秒)',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT '用户IP地址',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '浏览器UserAgent',
  `source` VARCHAR(50) NOT NULL DEFAULT 'h5' COMMENT '来源渠道: h5/wechat/app',
  `poster_image` LONGTEXT DEFAULT NULL COMMENT '海报图片Base64',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_user_phone` (`user_phone`),
  KEY `idx_result_type` (`result_type`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MBTI测试记录表';

-- 3. 统计汇总表
CREATE TABLE IF NOT EXISTS `mbti_statistics` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键',
  `result_type` CHAR(4) NOT NULL COMMENT '人格类型',
  `total_count` INT NOT NULL DEFAULT 0 COMMENT '该类型总人数',
  `percentage` DECIMAL(5,2) NOT NULL DEFAULT 0.00 COMMENT '占比百分比',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_result_type` (`result_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='MBTI统计汇总表';

-- 4. 初始化16种人格类型统计记录
INSERT INTO `mbti_statistics` (`result_type`, `total_count`, `percentage`) VALUES
  ('ISTJ', 0, 0.00), ('ISFJ', 0, 0.00), ('INFJ', 0, 0.00), ('INTJ', 0, 0.00),
  ('ISTP', 0, 0.00), ('ISFP', 0, 0.00), ('INFP', 0, 0.00), ('INTP', 0, 0.00),
  ('ESTP', 0, 0.00), ('ESFP', 0, 0.00), ('ENFP', 0, 0.00), ('ENTP', 0, 0.00),
  ('ESTJ', 0, 0.00), ('ESFJ', 0, 0.00), ('ENFJ', 0, 0.00), ('ENTJ', 0, 0.00)
ON DUPLICATE KEY UPDATE `result_type` = VALUES(`result_type`);

-- 5. 初始化36道题目数据
INSERT INTO `mbti_question` (`question_no`, `dimension`, `question_text`, `option_a_text`, `option_b_text`, `option_a_pole`, `option_b_pole`, `sort_order`) VALUES
(1,  'E_I', '在一个社交聚会上，你通常会：', '主动与很多人交谈，包括陌生人', '只与少数熟悉的人交谈', 'E', 'I', 1),
(2,  'S_N', '你更倾向于关注：', '事物的实际细节和具体事实', '事物背后的含义和可能性', 'S', 'N', 2),
(3,  'T_F', '在做重要决定时，你更倾向于：', '依据逻辑分析和客观事实', '考虑他人感受和价值观', 'T', 'F', 3),
(4,  'J_P', '你更喜欢的工作方式是：', '按照计划和时间表有序进行', '灵活应变，随机应对', 'J', 'P', 4),
(5,  'E_I', '工作了一整天后，你更倾向于：', '和朋友们一起出去放松', '独自待着安静地休息', 'E', 'I', 5),
(6,  'S_N', '阅读一本书时，你更关注：', '书中描述的具体情节和细节', '书中传达的深层主题和隐喻', 'S', 'N', 6),
(7,  'T_F', '当朋友向你倾诉烦恼时，你通常会：', '帮他们分析问题并提出解决方案', '先表示理解和同情，给予情感支持', 'T', 'F', 7),
(8,  'J_P', '关于旅行计划，你更倾向于：', '提前规划好行程和住宿', '到了目的地再随性安排', 'J', 'P', 8),
(9,  'E_I', '在团队讨论中，你通常：', '积极发言，喜欢头脑风暴', '先倾听思考，再发表意见', 'E', 'I', 9),
(10, 'S_N', '学习新技能时，你更喜欢：', '按照步骤一步步实际操作', '先了解整体框架和原理', 'S', 'N', 10),
(11, 'T_F', '在工作中需要给出负面反馈时，你会：', '直接、客观地指出问题所在', '委婉地表达，注意对方的感受', 'T', 'F', 11),
(12, 'J_P', '你的办公桌/房间通常是：', '整洁有序，物品归类摆放', '比较随意，但自己知道东西在哪', 'J', 'P', 12),
(13, 'E_I', '你更喜欢的沟通方式是：', '面对面交流或电话沟通', '通过文字消息或邮件沟通', 'E', 'I', 13),
(14, 'S_N', '面对一个新项目，你首先关注的是：', '现有的资源和实际可行性', '未来的发展潜力和创新可能', 'S', 'N', 14),
(15, 'T_F', '评价一个方案时，你更看重：', '方案的效率和逻辑合理性', '方案对相关人员的影响', 'T', 'F', 15),
(16, 'J_P', '面对deadline，你通常：', '提前完成，预留缓冲时间', '在截止日期前才集中精力完成', 'J', 'P', 16),
(17, 'E_I', '你认为自己更像：', '认识很多人的社交达人', '有几个知心好友的深度交往者', 'E', 'I', 17),
(18, 'S_N', '描述一件事情时，你倾向于：', '用具体的数据和事实来说明', '用比喻和类比来表达', 'S', 'N', 18),
(19, 'T_F', '在团队中出现分歧时，你认为应该：', '用客观标准和数据来判断对错', '寻求共识，照顾每个人的想法', 'T', 'F', 19),
(20, 'J_P', '你更享受：', '完成任务后的成就感', '探索过程中的新发现', 'J', 'P', 20),
(21, 'E_I', '参加一个你不太熟悉的活动时，你会：', '很快融入，主动认识新朋友', '观察一段时间后才逐渐参与', 'E', 'I', 21),
(22, 'S_N', '你更信赖：', '亲身经历和验证过的方法', '直觉和内心的预感', 'S', 'N', 22),
(23, 'T_F', '如果必须在两者之间选择，你认为更重要的是：', '追求真理，即使会伤害某些人的感情', '维护和谐，即使需要回避某些事实', 'T', 'F', 23),
(24, 'J_P', '购物时你通常：', '列好清单，目标明确地购买', '随意逛逛，看到喜欢的再买', 'J', 'P', 24),
(25, 'E_I', '在发表观点之前，你通常：', '边想边说，通过讨论来整理思路', '先在心里想清楚，再表达出来', 'E', 'I', 25),
(26, 'S_N', '你更欣赏的人是：', '务实可靠、脚踏实地的执行者', '富有创意、善于创新的思想者', 'S', 'N', 26),
(27, 'T_F', '你觉得好的领导者应该更注重：', '制定公平合理的制度和标准', '关心团队成员的个人发展和感受', 'T', 'F', 27),
(28, 'J_P', '对于规则和流程，你的态度是：', '遵守规则能保证效率和公平', '规则应该灵活变通，因情况而异', 'J', 'P', 28),
(29, 'E_I', '你获取能量的方式更多是：', '与他人互动和交流', '独处和自我反思', 'E', 'I', 29),
(30, 'S_N', '思考未来时，你更多关注：', '基于现实情况做出合理预测', '想象各种可能的发展方向', 'S', 'N', 30),
(31, 'T_F', '面对冲突时，你更倾向于：', '就事论事，理性地解决问题', '先安抚情绪，再处理事情', 'T', 'F', 31),
(32, 'J_P', '你认为理想的一天应该是：', '有清晰的日程安排，每件事按计划进行', '没有固定安排，可以随心所欲', 'J', 'P', 32),
(33, 'E_I', '在工作环境中，你更喜欢：', '开放式办公，方便随时与同事交流', '安静的独立空间，减少打扰', 'E', 'I', 33),
(34, 'S_N', '解决问题时，你更擅长：', '运用已有的经验和成熟的方法', '跳出框架，尝试全新的思路', 'S', 'N', 34),
(35, 'T_F', '你更认同哪种说法：', '公正比仁慈更重要', '仁慈比公正更重要', 'T', 'F', 35),
(36, 'J_P', '开始一项新工作时，你更倾向于：', '先制定详细的计划再行动', '先开始做，边做边调整方向', 'J', 'P', 36)
ON DUPLICATE KEY UPDATE `question_text` = VALUES(`question_text`);
