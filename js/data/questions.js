/**
 * MBTI 36道测试题目数据
 * 4个维度各9题，按题号%4交替排列：1→E/I, 2→S/N, 3→T/F, 0→J/P
 */
const MBTI_QUESTIONS = [
  // ========== 第1轮 ==========
  {
    questionNo: 1,
    dimension: 'E_I',
    text: '在一个社交聚会上，你通常会：',
    optionA: '主动与很多人交谈，包括陌生人',
    optionB: '只与少数熟悉的人交谈',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 2,
    dimension: 'S_N',
    text: '你更倾向于关注：',
    optionA: '事物的实际细节和具体事实',
    optionB: '事物背后的含义和可能性',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 3,
    dimension: 'T_F',
    text: '在做重要决定时，你更倾向于：',
    optionA: '依据逻辑分析和客观事实',
    optionB: '考虑他人感受和价值观',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 4,
    dimension: 'J_P',
    text: '你更喜欢的工作方式是：',
    optionA: '按照计划和时间表有序进行',
    optionB: '灵活应变，随机应对',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第2轮 ==========
  {
    questionNo: 5,
    dimension: 'E_I',
    text: '工作了一整天后，你更倾向于：',
    optionA: '和朋友们一起出去放松',
    optionB: '独自待着安静地休息',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 6,
    dimension: 'S_N',
    text: '阅读一本书时，你更关注：',
    optionA: '书中描述的具体情节和细节',
    optionB: '书中传达的深层主题和隐喻',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 7,
    dimension: 'T_F',
    text: '当朋友向你倾诉烦恼时，你通常会：',
    optionA: '帮他们分析问题并提出解决方案',
    optionB: '先表示理解和同情，给予情感支持',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 8,
    dimension: 'J_P',
    text: '关于旅行计划，你更倾向于：',
    optionA: '提前规划好行程和住宿',
    optionB: '到了目的地再随性安排',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第3轮 ==========
  {
    questionNo: 9,
    dimension: 'E_I',
    text: '在团队讨论中，你通常：',
    optionA: '积极发言，喜欢头脑风暴',
    optionB: '先倾听思考，再发表意见',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 10,
    dimension: 'S_N',
    text: '学习新技能时，你更喜欢：',
    optionA: '按照步骤一步步实际操作',
    optionB: '先了解整体框架和原理',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 11,
    dimension: 'T_F',
    text: '在工作中需要给出负面反馈时，你会：',
    optionA: '直接、客观地指出问题所在',
    optionB: '委婉地表达，注意对方的感受',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 12,
    dimension: 'J_P',
    text: '你的办公桌/房间通常是：',
    optionA: '整洁有序，物品归类摆放',
    optionB: '比较随意，但自己知道东西在哪',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第4轮 ==========
  {
    questionNo: 13,
    dimension: 'E_I',
    text: '你更喜欢的沟通方式是：',
    optionA: '面对面交流或电话沟通',
    optionB: '通过文字消息或邮件沟通',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 14,
    dimension: 'S_N',
    text: '面对一个新项目，你首先关注的是：',
    optionA: '现有的资源和实际可行性',
    optionB: '未来的发展潜力和创新可能',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 15,
    dimension: 'T_F',
    text: '评价一个方案时，你更看重：',
    optionA: '方案的效率和逻辑合理性',
    optionB: '方案对相关人员的影响',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 16,
    dimension: 'J_P',
    text: '面对deadline，你通常：',
    optionA: '提前完成，预留缓冲时间',
    optionB: '在截止日期前才集中精力完成',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第5轮 ==========
  {
    questionNo: 17,
    dimension: 'E_I',
    text: '你认为自己更像：',
    optionA: '认识很多人的社交达人',
    optionB: '有几个知心好友的深度交往者',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 18,
    dimension: 'S_N',
    text: '描述一件事情时，你倾向于：',
    optionA: '用具体的数据和事实来说明',
    optionB: '用比喻和类比来表达',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 19,
    dimension: 'T_F',
    text: '在团队中出现分歧时，你认为应该：',
    optionA: '用客观标准和数据来判断对错',
    optionB: '寻求共识，照顾每个人的想法',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 20,
    dimension: 'J_P',
    text: '你更享受：',
    optionA: '完成任务后的成就感',
    optionB: '探索过程中的新发现',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第6轮 ==========
  {
    questionNo: 21,
    dimension: 'E_I',
    text: '参加一个你不太熟悉的活动时，你会：',
    optionA: '很快融入，主动认识新朋友',
    optionB: '观察一段时间后才逐渐参与',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 22,
    dimension: 'S_N',
    text: '你更信赖：',
    optionA: '亲身经历和验证过的方法',
    optionB: '直觉和内心的预感',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 23,
    dimension: 'T_F',
    text: '如果必须在两者之间选择，你认为更重要的是：',
    optionA: '追求真理，即使会伤害某些人的感情',
    optionB: '维护和谐，即使需要回避某些事实',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 24,
    dimension: 'J_P',
    text: '购物时你通常：',
    optionA: '列好清单，目标明确地购买',
    optionB: '随意逛逛，看到喜欢的再买',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第7轮 ==========
  {
    questionNo: 25,
    dimension: 'E_I',
    text: '在发表观点之前，你通常：',
    optionA: '边想边说，通过讨论来整理思路',
    optionB: '先在心里想清楚，再表达出来',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 26,
    dimension: 'S_N',
    text: '你更欣赏的人是：',
    optionA: '务实可靠、脚踏实地的执行者',
    optionB: '富有创意、善于创新的思想者',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 27,
    dimension: 'T_F',
    text: '你觉得好的领导者应该更注重：',
    optionA: '制定公平合理的制度和标准',
    optionB: '关心团队成员的个人发展和感受',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 28,
    dimension: 'J_P',
    text: '对于规则和流程，你的态度是：',
    optionA: '遵守规则能保证效率和公平',
    optionB: '规则应该灵活变通，因情况而异',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第8轮 ==========
  {
    questionNo: 29,
    dimension: 'E_I',
    text: '你获取能量的方式更多是：',
    optionA: '与他人互动和交流',
    optionB: '独处和自我反思',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 30,
    dimension: 'S_N',
    text: '思考未来时，你更多关注：',
    optionA: '基于现实情况做出合理预测',
    optionB: '想象各种可能的发展方向',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 31,
    dimension: 'T_F',
    text: '面对冲突时，你更倾向于：',
    optionA: '就事论事，理性地解决问题',
    optionB: '先安抚情绪，再处理事情',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 32,
    dimension: 'J_P',
    text: '你认为理想的一天应该是：',
    optionA: '有清晰的日程安排，每件事按计划进行',
    optionB: '没有固定安排，可以随心所欲',
    poleA: 'J',
    poleB: 'P'
  },

  // ========== 第9轮 ==========
  {
    questionNo: 33,
    dimension: 'E_I',
    text: '在工作环境中，你更喜欢：',
    optionA: '开放式办公，方便随时与同事交流',
    optionB: '安静的独立空间，减少打扰',
    poleA: 'E',
    poleB: 'I'
  },
  {
    questionNo: 34,
    dimension: 'S_N',
    text: '解决问题时，你更擅长：',
    optionA: '运用已有的经验和成熟的方法',
    optionB: '跳出框架，尝试全新的思路',
    poleA: 'S',
    poleB: 'N'
  },
  {
    questionNo: 35,
    dimension: 'T_F',
    text: '你更认同哪种说法：',
    optionA: '公正比仁慈更重要',
    optionB: '仁慈比公正更重要',
    poleA: 'T',
    poleB: 'F'
  },
  {
    questionNo: 36,
    dimension: 'J_P',
    text: '开始一项新工作时，你更倾向于：',
    optionA: '先制定详细的计划再行动',
    optionB: '先开始做，边做边调整方向',
    poleA: 'J',
    poleB: 'P'
  }
];
