/**
 * 结果页组件
 */
const ResultPage = {
  template: '#result-template',
  setup() {
    const state = Vue.inject('state');
    const router = VueRouter.useRouter();
    const route = VueRouter.useRoute();

    const resultData = Vue.ref(null);
    const personality = Vue.ref(null);
    const dimensions = Vue.ref([]);
    const loading = Vue.ref(true);
    const showPoster = Vue.ref(false);
    const posterUrl = Vue.ref('');
    const generatingPoster = Vue.ref(false);

    const formatDuration = (seconds) => {
      const min = Math.floor(seconds / 60);
      const sec = seconds % 60;
      return min + ' 分 ' + sec + ' 秒';
    };

    // 隐藏手机号中间部分
    const maskPhone = (phone) => {
      if (!phone || phone.length !== 11) return phone;
      return phone.substring(0, 3) + '****' + phone.substring(7);
    };

    const loadResult = async () => {
      loading.value = true;

      // 优先使用内存中的结果
      if (state.result && state.result.recordId === route.params.id) {
        resultData.value = state.result;
        personality.value = state.result.personality;
        dimensions.value = MBTICalculator.getDimensionPercentages(state.result.scores);
        loading.value = false;
        return;
      }

      // 通过接口获取（分享链接场景）
      try {
        const res = await API.getResult(route.params.id);
        if (res.code === 200) {
          resultData.value = res.data;
          personality.value = res.data.personality;
          dimensions.value = MBTICalculator.getDimensionPercentages(res.data.scores);
        } else {
          vant.showToast(res.message || '出错啦');
          // router.replace('/');
        }
      } catch (e) {
        vant.showToast('加载失败');
        router.replace('/');
      } finally {
        loading.value = false;
      }
    };

    Vue.onMounted(() => {
      loadResult();
    });

    // 生成海报
    const generatePoster = async () => {
      if (generatingPoster.value) return;
      generatingPoster.value = true;

      try {
        const url = await PosterGenerator.generate(resultData.value);
        if (url) {
          posterUrl.value = url;
          showPoster.value = true;
        } else {
          vant.showToast('海报生成失败，请重试');
        }
      } catch (e) {
        console.error('海报生成失败:', e);
        vant.showToast('海报生成失败');
      } finally {
        generatingPoster.value = false;
      }
    };

    const closePoster = () => {
      showPoster.value = false;
    };

    // 再测一次
    const retakeTest = () => {
      // 保留用户信息，重置其他状态
      const savedUserName = resultData.value?.userName || state.userName;
      const savedUserPhone = resultData.value?.userPhone || state.userPhone;
      // const savedUserPosition = resultData.value?.userPosition || state.userPosition; // 岗位字段暂时隐藏
      
      // 重置全局状态但保留用户信息
      state.sessionId = null;
      state.currentIndex = 0;
      state.answers = new Array(state.maxQuestionsNum || 36).fill(null);
      state.timer.seconds = 0;
      state.timer.display = '00:00';
      state.result = null;
      state.isSubmitting = false;
      
      // 恢复用户信息
      state.userName = savedUserName;
      state.userPhone = savedUserPhone;
      // state.userPosition = savedUserPosition; // 岗位字段暂时隐藏
      
      router.push('/');
    };

    // 获取维度主色
    const getDimensionColor = (dim, side) => {
      if (!personality.value) return '#ccc';
      const color = personality.value.color;
      if (side === 'left') {
        return dim.left.percent >= 50 ? color : '#ccc';
      }
      return dim.right.percent > 50 ? color : '#ccc';
    };

    const getBarColor = () => {
      return personality.value ? personality.value.color : '#4F46E5';
    };

    return {
      resultData,
      personality,
      dimensions,
      loading,
      showPoster,
      posterUrl,
      generatingPoster,
      formatDuration,
      maskPhone,
      generatePoster,
      closePoster,
      retakeTest,
      getDimensionColor,
      getBarColor
    };
  }
};
