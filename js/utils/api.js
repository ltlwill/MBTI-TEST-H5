/**
 * API 接口封装
 * 包含 Mock 模式，前端开发时无需后端
 */
const API = {
  // 后端API基础路径，部署时修改
  // BASE_URL: '/api/mbti/v1',
  // BASE_URL: 'http://localhost:48080/admin-api',
  BASE_URL: 'https://47vdwg977360.vicp.fun/backend-service/admin-api',
  // Mock模式开关：true=使用本地数据，false=调用后端接口
  // MOCK_MODE: true,
  MOCK_MODE: false,

  /**
   * 获取题目列表
   */
  async getQuestions() {
    if (this.MOCK_MODE) {
      return { code: 200, data: { total: MBTI_QUESTIONS.length, questions: MBTI_QUESTIONS } };
    }
    const res = await axios.get(this.BASE_URL + '/questions');
    return res.data;
  },

  /**
   * 提交答题结果
   * @param {Object} params - { sessionId, userId, userName, userPhone, answers, durationSeconds, source, posterBase64 }
   */
  async submitTest(params) {
    if (this.MOCK_MODE) {
      // Mock模式：前端本地计算结果
      const { resultType, scores } = MBTICalculator.calculate(params.answers, MBTI_QUESTIONS);
      const personality = MBTI_PERSONALITIES[resultType];
      const recordId = 'mock_' + Date.now();
      
      // 保存用户信息和结果到缓存，用于后续查询
      const resultData = {
        recordId,
        resultType,
        scores,
        userName: params.userName,
        userPhone: params.userPhone,
        userPosition: params.userPosition,
        posterBase64: params.posterBase64,
        personality: {
          type: personality.type,
          name: personality.name,
          subtitle: personality.subtitle,
          color: personality.color,
          description: personality.description,
          strengths: personality.strengths,
          weaknesses: personality.weaknesses,
          careers: personality.careers,
          celebrities: personality.celebrities,
          population: personality.population,
          workStyle: personality.workStyle,
          loveStyle: personality.loveStyle
        },
        statistics: {
          totalParticipants: 58432,
          typePercentage: parseFloat(personality.population),
          typeRank: Math.floor(Math.random() * 16) + 1
        },
        durationSeconds: params.durationSeconds
      };
      
      // 同时缓存到用户查询索引
      this._cacheUserResult(params.userName, params.userPhone, resultData);

      return {
        code: 200,
        data: resultData
      };
    }
    const res = await axios.post(this.BASE_URL + '/open/erp/mbti-test/create', params);
    if(res && res.status === 200){
      return { code: 200, data: {recordId: res.data?.data}};
    }
    return { code: res.code, message: res.data?.msg};
  },
  
  /**
   * 缓存用户测试结果索引（Mock模式用）
   */
  _cacheUserResult(userName, userPhone, resultData) {
    try {
      const key = 'mbti_user_' + userName + '_' + userPhone;
      localStorage.setItem(key, JSON.stringify(resultData));
      // 同时按记录ID缓存
      this.cacheResult(resultData.recordId, resultData);
    } catch (e) {
      // localStorage 满了忽略
    }
  },
  
  /**
   * 通过姓名和手机号查询测试结果
   * @param {string} userName
   * @param {string} userPhone
   */
  async queryResultByUser(userName, userPhone) {
    if (this.MOCK_MODE) {
      // Mock模式：从localStorage读取
      const key = 'mbti_user_' + userName + '_' + userPhone;
      const cached = localStorage.getItem(key);
      if (cached) {
        return { code: 200, data: JSON.parse(cached) };
      }
      return { code: 404, message: '未找到该用户的测试记录' };
    }
    const res = await axios.get(this.BASE_URL + '/open/erp/mbti-test/query', {
      params: { userName, userPhone }
    });
    if(res && res.status === 200){
      return { code: 200, data: {recordId: res.data?.data}};
    }
    return { code: res.code, message: res.data?.msg};
  },

  /**
   * 查询单次测试结果（分享链接用）
   * @param {string} recordId
   */
  async getResult(recordId) {
    if (this.MOCK_MODE) {
      // Mock模式：从localStorage读取缓存结果
      const cached = localStorage.getItem('mbti_result_' + recordId);
      if (cached) {
        return { code: 200, data: JSON.parse(cached) };
      }
      return { code: 404, message: '记录不存在' };
    }
    const res = await axios.get(this.BASE_URL + '/open/erp/mbti-test/result/' + recordId);
    if(res && res.status === 200){
      const data = res.data?.data;
      Object.assign(data, {answers: JSON.parse(data.answersJson),scores: JSON.parse(data.scoresJson),personality: JSON.parse(data.personalityJson)});
      return { code: 200, data: data};
    }
    return { code: res.code, message: res.data?.msg};
  },

  /**
   * 获取统计分布
   */
  async getStatistics() {
    if (this.MOCK_MODE) {
      const distribution = Object.keys(MBTI_PERSONALITIES).map(type => ({
        type,
        count: Math.floor(Math.random() * 5000) + 500,
        percentage: parseFloat(MBTI_PERSONALITIES[type].population)
      }));
      const totalParticipants = distribution.reduce((sum, d) => sum + d.count, 0);
      return {
        code: 200,
        data: { totalParticipants, distribution }
      };
    }
    const res = await axios.get(this.BASE_URL + '/statistics');
    return res.data;
  },

  /**
   * 缓存测试结果到本地（Mock模式用）
   */
  cacheResult(recordId, data) {
    try {
      localStorage.setItem('mbti_result_' + recordId, JSON.stringify(data));
    } catch (e) {
      // localStorage 满了忽略
    }
  }
};
