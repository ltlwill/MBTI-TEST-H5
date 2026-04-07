/**
 * MBTI 计分算法
 */
const MBTICalculator = {
  /**
   * 计算MBTI结果
   * @param {Array} answers - 用户答案数组 [{questionNo: 1, answer: 'A'}, ...]
   * @param {Array} questions - 题目数据数组
   * @returns {Object} { resultType, scores }
   */
  calculate(answers, questions) {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    answers.forEach(ans => {
      const question = questions.find(q => q.questionNo === ans.questionNo);
      if (!question) return;

      if (ans.answer === 'A') {
        scores[question.poleA] += 1;
      } else if (ans.answer === 'B') {
        scores[question.poleB] += 1;
      }
    });

    const resultType =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    return { resultType, scores };
  },

  /**
   * 获取维度百分比（用于可视化）
   * @param {Object} scores - 各极性得分
   * @returns {Array} 四个维度的百分比数据
   */
  getDimensionPercentages(scores) {
    return [
      {
        left: { label: 'E', name: '外向', score: scores.E, percent: Math.round((scores.E / 9) * 100) },
        right: { label: 'I', name: '内向', score: scores.I, percent: Math.round((scores.I / 9) * 100) }
      },
      {
        left: { label: 'S', name: '实感', score: scores.S, percent: Math.round((scores.S / 9) * 100) },
        right: { label: 'N', name: '直觉', score: scores.N, percent: Math.round((scores.N / 9) * 100) }
      },
      {
        left: { label: 'T', name: '思考', score: scores.T, percent: Math.round((scores.T / 9) * 100) },
        right: { label: 'F', name: '情感', score: scores.F, percent: Math.round((scores.F / 9) * 100) }
      },
      {
        left: { label: 'J', name: '判断', score: scores.J, percent: Math.round((scores.J / 9) * 100) },
        right: { label: 'P', name: '感知', score: scores.P, percent: Math.round((scores.P / 9) * 100) }
      }
    ];
  }
};
