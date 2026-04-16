// 语言配置
const translations = {
  en: {
    closeTitle: "Close",
    copyTitle: "Copy URL",
    openNewTitle: "Open in new tab",
    copySuccess: "URL copied to clipboard",
    copyFailed: "Copy failed, please copy manually"
  },
  zh: {
    closeTitle: "关闭",
    copyTitle: "复制网址",
    openNewTitle: "在新标签页打开",
    copySuccess: "网址已复制到剪贴板",
    copyFailed: "复制失败，请手动复制"
  }
};

// 检测系统语言
function getSystemLanguage() {
  const language = navigator.language || navigator.userLanguage;
  return language.startsWith('zh') ? 'zh' : 'en';
}

// 获取当前页面是否在排除名单中
let isExcluded = false;

// 初始化
function init() {
  checkExclusionList();
  setupModal();
}

// 检查当前域名是否在排除名单中
function checkExclusionList() {
  chrome.runtime.sendMessage(
    { action: 'checkExclusionList', url: window.location.href },
    (response) => {
      isExcluded = response.isExcluded;
      if (!isExcluded) {
        setupLinkInterceptors();
      }
    }
  );
}

// 设置链接拦截器
function setupLinkInterceptors() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href) {
      // 检查是否是在新标签页打开的链接
      if (link.target === '_blank' || e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        showModal(link.href);
      }
    }
  });
}

// 设置 modal 结构
function setupModal() {
  const lang = getSystemLanguage();
  const translation = translations[lang] || translations.en;
  
  const modalContainer = document.createElement('div');
  modalContainer.id = 'modal-link-opener-container';
  modalContainer.innerHTML = `
    <div id="modal-link-opener-backdrop"></div>
    <div id="modal-link-opener-buttons">
      <button id="modal-link-opener-close" title="${translation.closeTitle}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg></button>
      <button id="modal-link-opener-copy" title="${translation.copyTitle}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M318-120q-82 0-140-58t-58-140q0-40 15-76t43-64l134-133 56 56-134 134q-17 17-25.5 38.5T200-318q0 49 34.5 83.5T318-200q23 0 45-8.5t39-25.5l133-134 57 57-134 133q-28 28-64 43t-76 15Zm79-220-57-57 223-223 57 57-223 223Zm251-28-56-57 134-133q17-17 25-38t8-44q0-50-34-85t-84-35q-23 0-44.5 8.5T558-726L425-592l-57-56 134-134q28-28 64-43t76-15q82 0 139.5 58T839-641q0 39-14.5 75T782-502L648-368Z"/></svg></button>
      <button id="modal-link-opener-open-new" title="${translation.openNewTitle}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg></button>
    </div>
    <div id="modal-link-opener-content">
      <iframe width="100%" height="100%" id="modal-link-opener-iframe" loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" sandbox="allow-scripts allow-same-origin" referrerpolicy="same-origin" importance="high" src=""></iframe>
    </div>
    <div id="modal-link-opener-toast" class="toast"></div>
  `;
  document.body.appendChild(modalContainer);

  // 绑定事件
  document.getElementById('modal-link-opener-backdrop').addEventListener('click', closeModal);
  document.getElementById('modal-link-opener-close').addEventListener('click', closeModal);
  document.getElementById('modal-link-opener-copy').addEventListener('click', copyUrl);
  document.getElementById('modal-link-opener-open-new').addEventListener('click', openInNewTab);
}

// 显示 modal
function showModal(url) {
  const modalContainer = document.getElementById('modal-link-opener-container');
  const iframe = document.getElementById('modal-link-opener-iframe');
  
  iframe.src = url;
  modalContainer.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// 关闭 modal
function closeModal() {
  const modalContainer = document.getElementById('modal-link-opener-container');
  const iframe = document.getElementById('modal-link-opener-iframe');
  
  iframe.src = '';
  modalContainer.style.display = 'none';
  document.body.style.overflow = '';
}

// 显示 toast 提示
function showToast(message) {
  const toast = document.getElementById('modal-link-opener-toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  // 3 秒后自动消失
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// 复制网址
function copyUrl() {
  const lang = getSystemLanguage();
  const translation = translations[lang] || translations.en;
  const iframe = document.getElementById('modal-link-opener-iframe');
  const url = iframe.src;
  
  if (url) {
    navigator.clipboard.writeText(url).then(() => {
      showToast(translation.copySuccess);
    }).catch(err => {
      console.error('复制失败:', err);
      showToast(translation.copyFailed);
    });
  }
}

// 在新标签页打开
function openInNewTab() {
  const iframe = document.getElementById('modal-link-opener-iframe');
  const url = iframe.src;
  
  if (url) {
    window.open(url, '_blank');
  }
  
  closeModal();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}