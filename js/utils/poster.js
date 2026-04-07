/**
 * 海报生成工具
 * 使用 html2canvas 将结果渲染为可分享的图片
 */
const PosterGenerator = {
  /**
   * 生成海报
   * @param {Object} resultData - 测试结果数据
   * @returns {Promise<string>} base64 图片地址
   */
  async generate(resultData) {
    const container = document.getElementById('poster-container');
    if (!container) return null;

    // 填充海报数据
    this.renderPoster(container, resultData);

    // 等待渲染完成
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const canvas = await html2canvas(container, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
        width: 375,
        height: 800,
        logging: false
      });

      return canvas.toDataURL('image/png');
    } catch (err) {
      console.error('海报生成失败:', err);
      return null;
    }
  },

  /**
   * 渲染海报内容到隐藏容器
   */
  renderPoster(container, data) {
    const personality = data.personality;
    const scores = data.scores;
    const dimensions = MBTICalculator.getDimensionPercentages(scores);
    
    // 用户信息处理
    const userName = data.userName || '';
    const userPhone = data.userPhone || '';
    const duration = data.durationSeconds || 0;
    const durationText = this.formatDuration(duration);
    
    // 手机号脱敏
    const maskPhone = (phone) => {
      if (!phone || phone.length !== 11) return phone;
      return phone.substring(0, 3) + '****' + phone.substring(7);
    };

    container.innerHTML = `
      <div class="poster-inner" style="
        width: 375px; height: 800px; padding: 24px 20px;
        background: linear-gradient(180deg, ${personality.color}20 0%, #ffffff 30%, #ffffff 70%, ${personality.color}10 100%);
        font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
        box-sizing: border-box; position: relative; overflow: hidden;
      ">
        <div style="text-align:center; margin-bottom: 16px;">
          <div style="font-size: 13px; color: #999; letter-spacing: 2px;">MBTI 职业性格测试</div>
        </div>

        <div style="text-align:center; margin-bottom: 12px;">
          <div style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 64px; height: 64px; border-radius: 16px;
            background: ${personality.color}; color: #fff;
            font-size: 22px; font-weight: bold; margin-bottom: 10px;
          ">${personality.type}</div>
          <!-- <div style="font-size: 22px; font-weight: bold; color: #1a1a1a;">${personality.name}</div> -->
          <div style="font-size: 13px; color: ${personality.color}; margin-top: 4px;">${personality.subtitle}</div>
        </div>
        
        <!-- 用户信息卡片 -->
        ${(userName || userPhone || duration) ? `
        <div style="margin-bottom: 14px; background: linear-gradient(135deg, ${personality.color} 0%, ${personality.color}DD 100%); border-radius: 12px; padding: 12px 16px; display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap; box-shadow: 0 4px 12px ${personality.color}40;">
          ${userName ? `
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11px; opacity: 0.9;">&#x1F464;</span>
              <span style="font-size: 13px; color: #fff; font-weight: 500;">${userName}</span>
            </div>
          ` : ''}
          ${userPhone ? `
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11px; opacity: 0.9;">&#x1F4F1;</span>
              <span style="font-size: 12px; color: #fff; font-family: monospace; letter-spacing: 0.5px;">${maskPhone(userPhone)}</span>
            </div>
          ` : ''}
          ${/* 岗位字段暂时隐藏，后续需要时可取消注释
          ${userPosition ? `
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11px; opacity: 0.9;">&#x1F4BC;</span>
              <span style="font-size: 12px; color: #fff;">${userPosition}</span>
            </div>
          ` : ''}
          */''}
          ${duration ? `
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 11px; opacity: 0.9;">&#x23F1;</span>
              <span style="font-size: 12px; color: #fff;">${durationText}</span>
            </div>
          ` : ''}
        </div>
        ` : ''}

        <div style="margin-bottom: 14px;">
          ${dimensions.map(d => `
            <div style="display:flex; align-items:center; margin-bottom: 6px; font-size: 11px;">
              <span style="width: 24px; color: ${d.left.percent >= 50 ? personality.color : '#999'}; font-weight: ${d.left.percent >= 50 ? 'bold' : 'normal'};">${d.left.label}</span>
              <div style="flex:1; height: 6px; background: #f0f0f0; border-radius: 3px; overflow: hidden; display: flex;">
                <div style="width: ${d.left.percent}%; background: ${personality.color}; border-radius: 3px;"></div>
              </div>
              <span style="width: 24px; text-align: right; color: ${d.right.percent > 50 ? personality.color : '#999'}; font-weight: ${d.right.percent > 50 ? 'bold' : 'normal'};">${d.right.label}</span>
            </div>
          `).join('')}
        </div>

        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #1a1a1a; margin-bottom: 3px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 4px; height: 12px; background: ${personality.color}; border-radius: 2px; margin-right: 6px;"></span>
            性格描述
          </div>
          <div style="font-size: 10px; color: #666; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${personality.description}</div>
        </div>

        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 4px; height: 12px; background: ${personality.color}; border-radius: 2px; margin-right: 6px;"></span>
            性格优点
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${personality.strengths.map(s => `
              <span style="
                display: inline-block; padding: 2px 6px; font-size: 10px;
                background: ${personality.color}15; color: ${personality.color};
                border-radius: 8px;
              ">${s}</span>
            `).join('')}
          </div>
        </div>
        
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 4px; height: 12px; background: #FF9800; border-radius: 2px; margin-right: 6px;"></span>
            性格缺点
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${personality.weaknesses.map(w => `
              <span style="
                display: inline-block; padding: 2px 6px; font-size: 10px;
                background: #FFF3E0; color: #E65100;
                border-radius: 8px;
              ">${w}</span>
            `).join('')}
          </div>
        </div>
        
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 4px; height: 12px; background: ${personality.color}; border-radius: 2px; margin-right: 6px;"></span>
            推荐职业
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${personality.careers.slice(0, 4).map(c => `
              <span style="
                display: inline-flex; align-items: center; gap: 4px;
                padding: 2px 6px; font-size: 10px;
                background: ${personality.color}08; color: #333;
                border-radius: 8px;
              ">${c}</span>
            `).join('')}
          </div>
        </div>
        
        <div style="margin-bottom: 10px;">
          <div style="font-size: 11px; font-weight: bold; color: #1a1a1a; margin-bottom: 4px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 4px; height: 12px; background: ${personality.color}; border-radius: 2px; margin-right: 6px;"></span>
            代表人物
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${personality.celebrities.map(c => `
              <span style="
                display: inline-block; padding: 2px 8px; font-size: 10px;
                background: #f8f8f8; color: #666;
                border-radius: 10px;
              ">${c}</span>
            `).join('')}
          </div>
        </div>

        <div style="
          position: absolute; bottom: 16px; left: 24px; right: 24px;
          text-align: center; padding-top: 10px;
          border-top: 1px solid #f0f0f0;
        ">
          <div style="font-size: 10px; color: #999;">MBTI 16型人格职业性格测试</div>
        </div>
      </div>
    `;
  },
  
  /**
   * 格式化时长
   */
  formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return min + '分' + sec + '秒';
  }
};
