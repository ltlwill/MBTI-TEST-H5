/**
 * Vue 应用初始化
 */
(function () {
  const { createApp, reactive, provide } = Vue;
  const { createRouter, createWebHashHistory } = VueRouter;
  const maxQuestionsNum = 36;
  // const maxQuestionsNum = 1;

  // 全局状态
  const globalState = reactive({
    sessionId: null,
    userName: '',
    userPhone: '',
    userPosition: '',
    currentIndex: 0,
    answers: new Array(maxQuestionsNum).fill(null),
    timer: {
      seconds: 0,
      display: '00:00'
    },
    result: null,
    isSubmitting: false,
    maxQuestionsNum: maxQuestionsNum
  });

  // 路由配置
  const routes = [
    { path: '/', component: HomePage, meta: { title: 'MBTI职业性格测试' } },
    { path: '/test', component: TestPage, meta: { title: '答题中' } },
    { path: '/result/:id', component: ResultPage, meta: { title: '测试结果' } }
  ];

  const router = createRouter({
    history: createWebHashHistory(),
    routes
  });

  // 路由守卫：设置页面标题
  router.afterEach((to) => {
    document.title = to.meta.title || 'MBTI职业性格测试';
  });

  // 创建 Vue 应用
  const app = createApp({
    template: '#app-template',
    setup() {
      provide('state', globalState);
      return {};
    }
  });

  // 使用插件
  app.use(router);
  app.use(vant);

  // 挂载
  app.mount('#app');
})();
