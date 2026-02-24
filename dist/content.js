// X/Twitter 搜索助手 Content Script
console.log('X Search Helper content script loaded');

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'applySearchQuery') {
    console.log('收到搜索查询:', request.query);
    applySearchQuery(request.query);
    sendResponse({ success: true });
  }
  return true;
});

// 应用搜索查询到页面
function applySearchQuery(query) {
  console.log('正在应用搜索查询:', query);
  
  // 尝试找到搜索框
  const searchBox = findSearchBox();
  
  if (searchBox) {
    // 清空搜索框并输入查询
    searchBox.value = query;
    
    // 触发输入事件
    const inputEvent = new Event('input', { bubbles: true });
    searchBox.dispatchEvent(inputEvent);
    
    // 触发变化事件
    const changeEvent = new Event('change', { bubbles: true });
    searchBox.dispatchEvent(changeEvent);
    
    // 尝试触发搜索（如果有搜索按钮）
    triggerSearch(searchBox);
    
    console.log('搜索查询已应用到搜索框');
    
    // 显示成功提示
    showNotification('搜索模板已应用！请在结果页面选择"Latest"进行筛选。');
  } else {
    console.log('未找到搜索框，等待页面加载...');
    
    // 如果没找到搜索框，可能是页面还没加载完
    // 等待一段时间后重试
    setTimeout(() => {
      const retrySearchBox = findSearchBox();
      if (retrySearchBox) {
        retrySearchBox.value = query;
        triggerSearch(retrySearchBox);
        showNotification('搜索模板已应用！');
      } else {
        showNotification('未找到搜索框，请刷新页面后重试。', 'error');
      }
    }, 1000);
  }
}

// 查找搜索框
function findSearchBox() {
  // 尝试多种选择器，适应 X/Twitter 的不同版本
  const selectors = [
    // X.com 新版
    'input[data-testid="SearchBox_Search_Input"]',
    'input[aria-label="Search query"]',
    'input[placeholder*="Search"]',
    'input[type="search"]',
    
    // Twitter 旧版
    'input[data-testid="SearchBox_Search_Input"]',
    'input[name="q"]',
    'input[aria-label="Search Twitter"]',
    
    // 通用选择器
    'form[role="search"] input',
    '.r-30o5oe[type="text"]',
    '[data-testid="searchBox"] input'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.offsetParent !== null) {
      console.log('找到搜索框:', selector);
      return element;
    }
  }
  
  return null;
}

// 触发搜索
function triggerSearch(searchBox) {
  // 尝试触发回车键
  const enterEvent = new KeyboardEvent('keydown', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    bubbles: true,
    cancelable: true
  });
  
  searchBox.dispatchEvent(enterEvent);
  
  // 也尝试触发 keyup 事件
  const enterUpEvent = new KeyboardEvent('keyup', {
    key: 'Enter',
    code: 'Enter',
    keyCode: 13,
    bubbles: true,
    cancelable: true
  });
  
  searchBox.dispatchEvent(enterUpEvent);
  
  // 尝试找到并点击搜索按钮
  const searchButtons = [
    'button[data-testid="SearchBox_Search_Button"]',
    'button[aria-label="Search"]',
    'button[type="submit"]',
    'form[role="search"] button',
    '.r-1f1sjgu[type="submit"]'
  ];
  
  for (const selector of searchButtons) {
    const button = document.querySelector(selector);
    if (button) {
      button.click();
      console.log('点击了搜索按钮:', selector);
      break;
    }
  }
}

// 显示通知
function showNotification(message, type = 'success') {
  // 移除现有的通知
  const existingNotification = document.getElementById('x-search-helper-notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // 创建通知元素
  const notification = document.createElement('div');
  notification.id = 'x-search-helper-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'error' ? '#f8d7da' : '#d4edda'};
    color: ${type === 'error' ? '#721c24' : '#155724'};
    border: 1px solid ${type === 'error' ? '#f5c6cb' : '#c3e6cb'};
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // 添加动画样式
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // 5秒后自动移除
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

// 监听页面变化，重新注入搜索框监听
let observer = null;

function initObserver() {
  // 观察 DOM 变化，确保搜索框可用时能检测到
  observer = new MutationObserver(function(mutations) {
    // 检查是否有新的搜索框出现
    const searchBox = findSearchBox();
    if (searchBox && !searchBox.dataset.xSearchHelperInjected) {
      // 标记已注入
      searchBox.dataset.xSearchHelperInjected = 'true';
      
      // 添加自定义样式类
      searchBox.classList.add('x-search-helper-enhanced');
      
      // 添加焦点样式
      searchBox.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
        this.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
      });
      
      searchBox.addEventListener('blur', function() {
        this.style.borderColor = '';
        this.style.boxShadow = '';
      });
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initObserver);
} else {
  initObserver();
}

// 添加自定义样式
const style = document.createElement('style');
style.textContent = `
  .x-search-helper-enhanced {
    transition: border-color 0.3s, box-shadow 0.3s !important;
  }
  
  .x-search-helper-enhanced:focus {
    border-color: #667eea !important;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2) !important;
  }
`;
document.head.appendChild(style);

console.log('X Search Helper 初始化完成');