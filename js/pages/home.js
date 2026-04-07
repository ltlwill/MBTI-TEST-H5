/**
 * 首页组件
 */
const HomePage = {
  template: '#home-template',
  setup() {
    const state = Vue.inject('state');
    const router = VueRouter.useRouter();
    const { showToast, showLoadingToast, closeToast } = vant;
    const participantCount = Vue.ref(0);
    const loading = Vue.ref(false);
    
    // 用户信息
    const userName = Vue.ref('');
    const userPhone = Vue.ref('');
    const userPosition = Vue.ref('');

    Vue.onMounted(async () => {
      // 从全局状态回显用户信息（重新测试时保留）
      if (state.userName) {
        userName.value = state.userName;
      }
      if (state.userPhone) {
        userPhone.value = state.userPhone;
      }
      if (state.userPosition) {
        userPosition.value = state.userPosition;
      }
      
      // try {
      //   const res = await API.getStatistics();
      //   if (res.code === 200) {
      //     participantCount.value = res.data.totalParticipants;
      //   }
      // } catch (e) {
      //   participantCount.value = 58432;
      // }
    });

    const formatNumber = (num) => {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w+';
      }
      return num.toLocaleString();
    };
    
    // 验证手机号格式
    const validatePhone = (phone) => {
      const phoneRegex = /^1[3-9]\d{9}$/;
      return phoneRegex.test(phone);
    };

    const startTest = () => {
      // 验证姓名
      if (!userName.value || userName.value.trim() === '') {
        showToast('请输入您的姓名');
        return;
      }
      
      // 验证手机号
      if (!userPhone.value || userPhone.value.trim() === '') {
        showToast('请输入您的手机号');
        return;
      }
      
      if (!validatePhone(userPhone.value)) {
        showToast('请输入正确的手机号格式');
        return;
      }

      // 生成会话ID
      state.sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });

      // 保存用户信息
      state.userName = userName.value.trim();
      state.userPhone = userPhone.value.trim();
      state.userPosition = userPosition.value.trim();

      // 重置状态
      state.currentIndex = 0;
      state.answers = new Array(state.maxQuestionsNum).fill(null);
      state.timer.seconds = 0;
      state.timer.display = '00:00';
      state.result = null;
      state.isSubmitting = false;

      router.push('/test');
    };
    
    // 查询测试结果
    const queryResult = async () => {
      // 验证表单 - 直接使用页面上方输入的姓名和手机号
      if (!userName.value || userName.value.trim() === '') {
        showToast('请输入您的姓名');
        return;
      }
      
      if (!userPhone.value || userPhone.value.trim() === '') {
        showToast('请输入您的手机号');
        return;
      }
      
      if (!validatePhone(userPhone.value)) {
        showToast('请输入正确的手机号格式');
        return;
      }
      
      showLoadingToast({
        message: '查询中...',
        forbidClick: true
      });
      
      try {
        const res = await API.queryResultByUser(userName.value.trim(), userPhone.value.trim());
        closeToast();
        
        if (res.code === 200 && res.data && res.data.recordId) {
          // 跳转到结果页
          state.result = res.data;
          router.push('/result/' + res.data.recordId);
        } else {
          showToast(res.message || '未找到测试记录');
        }
      } catch (e) {
        closeToast();
        showToast('查询失败，请稍后重试');
      }
    };

    return {
      participantCount,
      formatNumber,
      startTest,
      loading,
      userName,
      userPhone,
      queryResult
    };
  }
};
