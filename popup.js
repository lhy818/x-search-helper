// 模板数据
const templates = {
  chinese: [
    {
      id: 'chinese-1',
      name: '4小时内高质量热议',
      query: 'lang:zh-cn min_faves:300 within_time:4h',
      description: '4小时内正在爆发的高质量热议'
    },
    {
      id: 'chinese-2',
      name: '24小时万赞神贴',
      query: 'lang:zh-cn min_faves:10000 -is:retweet',
      description: '24小时内华语圈最顶级的万赞神贴'
    },
    {
      id: 'chinese-3',
      name: '中文AI圈爆款',
      query: '"AI" OR "提示词" OR "大模型" lang:zh-cn min_faves:500',
      description: '捕捉中文AI圈当下的爆款内容'
    },
    {
      id: 'chinese-4',
      name: '12小时带图热门',
      query: 'filter:images lang:zh-cn min_faves:500 within_time:12h',
      description: '锁定12小时内带图的中文热门帖子'
    },
    {
      id: 'chinese-5',
      name: '高质量长贴原创',
      query: '"关键词" -filter:replies -is:retweet min_faves:100',
      description: '排除回复，只看高质量的长贴原创'
    }
  ],
  japanese: [
    {
      id: 'japanese-1',
      name: '1小时刚起飞高赞贴',
      query: 'lang:ja min_faves:500 within_time:1h -is:retweet',
      description: '日区1小时内刚起飞的高赞贴（蓝V抢热评神技）'
    },
    {
      id: 'japanese-2',
      name: '4小时最高视觉内容',
      query: 'lang:ja min_faves:2000 filter:images within_time:4h',
      description: '捕捉日本4小时内点赞最高的视觉/图片内容'
    },
    {
      id: 'japanese-3',
      name: '社会民生槽点',
      query: '"なにか" OR "最高" lang:ja min_faves:3000',
      description: '寻找日区当前的社会民生槽点（极易产生共鸣）'
    },
    {
      id: 'japanese-4',
      name: '24小时二次元动向',
      query: '#ポケモン OR #イラスト lang:ja min_faves:5000 within_time:24h',
      description: '监控日区24小时内最热门的二次元动向'
    },
    {
      id: 'japanese-5',
      name: '投资理财高质量讨论',
      query: '"資産運用" OR "新NISA" lang:ja min_faves:500',
      description: '锁定日本投资/理财领域的高质量讨论'
    }
  ],
  global: [
    {
      id: 'global-1',
      name: '12小时AI顶级神贴',
      query: '"AI" OR "ChatGPT" lang:en min_faves:5000 within_time:12h',
      description: '捕捉全球AI圈12小时内的顶级神贴'
    },
    {
      id: 'global-2',
      name: '4小时疯传高权重视频',
      query: 'lang:en min_faves:1000 filter:native_video within_time:4h',
      description: '寻找美区4小时内正在疯传的高权重视频'
    },
    {
      id: 'global-3',
      name: '金融投资高赞观点',
      query: '"Investing" OR "SPY" lang:en min_faves:2000',
      description: '搜集全球金融/投资大V的最新高赞观点'
    },
    {
      id: 'global-4',
      name: '4小时全球最火原创',
      query: '"the" OR "の" OR "了" min_faves:5000 -is:retweet within_time:12h',
      description: '寻找4小时内全球范围内最火的原创内容（全语种）'
    },
    {
      id: 'global-5',
      name: '12小时英文技术干货',
      query: 'lang:en min_faves:10000 -filter:links within_time:12h',
      description: '锁定12小时内点赞过万的英文技术/干货贴'
    }
  ]
};

// 自定义模板存储
let customTemplates = [];

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initTabs();
  initTemplateButtons();
  initCustomTemplateForm();
  loadCustomTemplates();
  initApplySearchButton();
});

// 初始化标签页
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // 更新按钮状态
      tabBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // 更新内容显示
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-tab`) {
          content.classList.add('active');
        }
      });
    });
  });
}

// 初始化模板按钮
function initTemplateButtons() {
  document.querySelectorAll('.use-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const card = this.closest('.template-card');
      const templateId = card.getAttribute('data-template');
      const customKeyword = document.getElementById('custom-keyword').value.trim();
      
      // 找到对应的模板
      let template = null;
      for (const category in templates) {
        template = templates[category].find(t => t.id === templateId);
        if (template) break;
      }
      
      if (template) {
        applyTemplate(template.query, customKeyword);
      }
    });
  });
}

// 初始化自定义模板表单
function initCustomTemplateForm() {
  const saveBtn = document.getElementById('save-template');
  saveBtn.addEventListener('click', saveCustomTemplate);
}

// 初始化应用到当前页面按钮
function initApplySearchButton() {
  const applyBtn = document.getElementById('apply-search');
  applyBtn.addEventListener('click', function() {
    const customKeyword = document.getElementById('custom-keyword').value.trim();
    const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
    
    // 获取当前激活标签页的第一个模板
    let template = null;
    if (templates[activeTab] && templates[activeTab].length > 0) {
      template = templates[activeTab][0];
      applyTemplate(template.query, customKeyword);
    } else {
      alert('请先选择一个模板');
    }
  });
}

// 应用模板到当前页面
function applyTemplate(query, customKeyword = '') {
  // 如果有自定义关键词，替换模板中的"关键词"占位符
  let finalQuery = query;
  if (customKeyword) {
    finalQuery = query.replace('"关键词"', `"${customKeyword}"`);
  }
  
  // 发送消息给 content script
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs[0] && (tabs[0].url.includes('x.com') || tabs[0].url.includes('twitter.com'))) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'applySearchQuery',
        query: finalQuery
      }, function(response) {
        if (chrome.runtime.lastError) {
          // content script 可能未加载，尝试注入
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }, () => {
            // 重新发送消息
            setTimeout(() => {
              chrome.tabs.sendMessage(tabs[0].id, {
                action: 'applySearchQuery',
                query: finalQuery
              });
            }, 500);
          });
        }
      });
      
      // 关闭弹窗
      window.close();
    } else {
      alert('请先打开 X/Twitter 网站');
    }
  });
}

// 保存自定义模板
function saveCustomTemplate() {
  const name = document.getElementById('template-name').value.trim();
  const query = document.getElementById('template-query').value.trim();
  const desc = document.getElementById('template-desc').value.trim();
  const category = document.getElementById('template-category').value;
  
  if (!name || !query) {
    alert('请填写模板名称和搜索语法');
    return;
  }
  
  const newTemplate = {
    id: `custom-${Date.now()}`,
    name,
    query,
    description: desc,
    category
  };
  
  customTemplates.push(newTemplate);
  saveCustomTemplates();
  renderCustomTemplates();
  
  // 清空表单
  document.getElementById('template-name').value = '';
  document.getElementById('template-query').value = '';
  document.getElementById('template-desc').value = '';
  
  alert('模板保存成功！');
}

// 保存自定义模板到存储
function saveCustomTemplates() {
  chrome.storage.local.set({ customTemplates: customTemplates });
}

// 加载自定义模板
function loadCustomTemplates() {
  chrome.storage.local.get(['customTemplates'], function(result) {
    if (result.customTemplates) {
      customTemplates = result.customTemplates;
      renderCustomTemplates();
    }
  });
}

// 渲染自定义模板列表
function renderCustomTemplates() {
  const container = document.getElementById('custom-templates-list');
  container.innerHTML = '';
  
  if (customTemplates.length === 0) {
    container.innerHTML = '<p style="color: #6c757d; text-align: center;">暂无自定义模板</p>';
    return;
  }
  
  customTemplates.forEach(template => {
    const item = document.createElement('div');
    item.className = 'custom-template-item';
    item.innerHTML = `
      <div class="template-info">
        <h5>${template.name}</h5>
        <code>${template.query}</code>
        ${template.description ? `<p style="font-size: 12px; color: #6c757d; margin-top: 5px;">${template.description}</p>` : ''}
      </div>
      <div class="template-actions">
        <button class="use-custom-btn" data-id="${template.id}">使用</button>
        <button class="delete-custom-btn" data-id="${template.id}">删除</button>
      </div>
    `;
    
    container.appendChild(item);
  });
  
  // 添加事件监听器
  document.querySelectorAll('.use-custom-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const templateId = this.getAttribute('data-id');
      const template = customTemplates.find(t => t.id === templateId);
      const customKeyword = document.getElementById('custom-keyword').value.trim();
      
      if (template) {
        applyTemplate(template.query, customKeyword);
      }
    });
  });
  
  document.querySelectorAll('.delete-custom-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const templateId = this.getAttribute('data-id');
      if (confirm('确定要删除这个模板吗？')) {
        customTemplates = customTemplates.filter(t => t.id !== templateId);
        saveCustomTemplates();
        renderCustomTemplates();
      }
    });
  });
}

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'templateApplied') {
    console.log('模板已应用到页面');
  }
});