/**
 * 答题页组件
 */
const TestPage = {
  template: '#test-template',
  setup() {
    const state = Vue.inject('state');
    const router = VueRouter.useRouter();
    const direction = Vue.ref('left');

    const currentQuestion = Vue.computed(() => {
      return MBTI_QUESTIONS[state.currentIndex] || null;
    });

    const progressPercent = Vue.computed(() => {
      const answered = state.answers.filter(a => a !== null).length;
      return Math.round((answered / state.maxQuestionsNum) * 100);
    });

    const currentIndex = Vue.computed(() => state.currentIndex);
    
    const isFirst = Vue.computed(() => {
      return currentIndex.value === 0;
    });
    const isLast = Vue.computed(() => {
      return currentIndex.value === state.maxQuestionsNum - 1;
    });

    const currentAnswer = Vue.computed(() => {
      return state.answers[state.currentIndex];
    });

    // 计时器
    let timerInterval = null;

    const startTimer = () => {
      stopTimer();
      timerInterval = setInterval(() => {
        state.timer.seconds++;
        const min = Math.floor(state.timer.seconds / 60);
        const sec = state.timer.seconds % 60;
        state.timer.display = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
      }, 1000);
    };

    const stopTimer = () => {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    };

    Vue.onMounted(() => {
      if (!state.sessionId) {
        router.replace('/');
        return;
      }
      startTimer();
    });

    Vue.onUnmounted(() => {
      stopTimer();
    });

    // 选择答案
    const selectOption = (option) => {
      state.answers[state.currentIndex] = option;

      // 自动跳下一题（非最后一题）
      if (!isLast.value) {
        setTimeout(() => {
          goNext();
        }, 350);
      }
      // 最后一题勾选后，不自动提交，显示提交按钮等待用户手动提交
    };

    const goPrev = () => {
      if (isFirst.value) return;
      direction.value = 'right';
      Vue.nextTick(() => {
        state.currentIndex--;
      });
    };

    const goNext = () => {
      if (isLast.value) return;
      
      // 检查当前题目是否已选择答案
      if (currentAnswer.value === null) {
        vant.showToast('请先选择答案');
        return;
      }
      
      direction.value = 'left';
      Vue.nextTick(() => {
        state.currentIndex++;
      });
    };

    // 提交
    const submitTest = async () => {
      // 检查是否全部作答
      const unanswered = state.answers.findIndex(a => a === null);
      if (unanswered !== -1) {
        vant.showToast('还有题目未作答，请检查第 ' + (unanswered + 1) + ' 题');
        direction.value = unanswered > state.currentIndex ? 'left' : 'right';
        Vue.nextTick(() => {
          state.currentIndex = unanswered;
        });
        return;
      }

      // 确认提交
      try {
        await vant.showDialog({
          title: '确认提交',
          message: '您将提交测试数据，是否继续？',
          confirmButtonText: '确定提交',
          cancelButtonText: '再检查一下',
          showCancelButton: true,
          confirmButtonColor: '#4F46E5'
        });
      } catch (e) {
        // 用户取消提交
        return;
      }

      if (state.isSubmitting) return;
      state.isSubmitting = true;

      stopTimer();
      
      // 显示提交中提示
      const loadingToast = vant.showLoadingToast({
        message: '提交中...',
        forbidClick: true,
        duration: 0
      });

      try {
        const answers = state.answers.map((ans, idx) => ({
          questionNo: idx + 1,
          answer: ans
        }));
        
        // 先计算结果用于生成海报
        const { resultType, scores } = MBTICalculator.calculate(answers, MBTI_QUESTIONS);
        const personality = MBTI_PERSONALITIES[resultType];
        
        // 生成海报数据（不弹出海报，仅生成 base64）
        const posterData = {
          recordId: 'temp_' + Date.now(),
          resultType,
          scores,
          userName: state.userName,
          userPhone: state.userPhone,
          // userPosition: state.userPosition, // 岗位字段暂时隐藏
          personality,
          durationSeconds: state.timer.seconds
        };
        
        // 生成海报图片base64（后台生成，前端不展示）
        let posterBase64 = '';
        try {
          posterBase64 = await PosterGenerator.generate(posterData) || '';
        } catch (posterErr) {
          console.error('海报生成失败:', posterErr);
          // 海报生成失败不影响提交，继续提交测试
        }
        const data = {
          sessionId: state.sessionId,
          userId: null,
          userName: state.userName,
          userPhone: state.userPhone,
          // userPosition: state.userPosition, // 岗位字段暂时隐藏
          personalityName: personality.name,
          personalityType: personality.type,
          personalitySubtitle: personality.subtitle,
          resultType: resultType,
          answers: answers,
          answersJson: JSON.stringify(answers),
          scoresJson: JSON.stringify(scores),
          personalityJson: JSON.stringify(personality),
          durationSeconds: state.timer.seconds,
          source: 'h5',
          posterImage: posterBase64
        }
        const arr = ['E','I','S','N','T','F','J','P']
        arr.forEach(item => {
          data['score' + item] = scores[item];
        });
        const res = await API.submitTest(data);

        loadingToast.close();

        if (res.code === 200) {
          state.result = res.data;
          // Mock模式缓存结果
          if (API.MOCK_MODE) {
            API.cacheResult(res.data.recordId, res.data);
          }
          router.replace('/result/' + res.data.recordId);
        } else {
          vant.showToast('提交失败，请重试');
        }
      } catch (e) {
        loadingToast.close();
        console.error('提交失败:', e);
        vant.showToast('网络异常，请重试');
      } finally {
        state.isSubmitting = false;
      }
    };

    // 返回确认
    const goBack = () => {
      vant.showDialog({
        title: '确认退出',
        message: '答题进度将不会保存，确定退出吗？',
        confirmButtonText: '继续答题',
        cancelButtonText: '退出',
        showCancelButton: true,
        confirmButtonColor: '#4F46E5'
      }).then(() => {
        // 继续答题
      }).catch(() => {
        stopTimer();
        router.replace('/');
      });
    };

    return {
      state,
      currentQuestion,
      progressPercent,
      currentIndex,
      isFirst,
      isLast,
      currentAnswer,
      direction,
      selectOption,
      goPrev,
      goNext,
      submitTest,
      goBack
    };
  }
};
