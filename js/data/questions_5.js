/**
 * MBTI 36道测试题目数据
 * 4个维度各9题，按题号%4交替排列：1→E/I, 2→S/N, 3→T/F, 0→J/P
 */
const MBTI_QUESTIONS_FIVE = [
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
   {
    questionNo: 5,
    dimension: 'E_I',
    text: '工作了一整天后，你更倾向于：',
    optionA: '和朋友们一起出去放松',
    optionB: '独自待着安静地休息',
    poleA: 'E',
    poleB: 'I'
  },
];
