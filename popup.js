// 语言配置
const translations = {
  en: {
    extensionTitle: "A Modal",
    domainLabel: "Current domain:",
    toggleLabel: "Add to exclusion list",
    listTitle: "Excluded domains",
    noDomains: "No excluded domains",
    removeBtn: "Remove"
  },
  zh: {
    extensionTitle: "A Modal",
    domainLabel: "当前域名:",
    toggleLabel: "添加到排除名单",
    listTitle: "排除名单域名",
    noDomains: "暂无排除名单域名",
    removeBtn: "移除"
  }
};

// 检测系统语言
function getSystemLanguage() {
  const language = navigator.language || navigator.userLanguage;
  return language.startsWith('zh') ? 'zh' : 'en';
}

// 更新界面语言
function updateLanguage() {
  const lang = getSystemLanguage();
  const translation = translations[lang] || translations.en;
  
  document.getElementById('extension-title').textContent = translation.extensionTitle;
  document.getElementById('domain-label').innerHTML = `${translation.domainLabel} <span id="current-domain"></span>`;
  document.getElementById('toggle-label').textContent = translation.toggleLabel;
  document.getElementById('list-title').textContent = translation.listTitle;
  
  // 更新移除按钮文本
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.textContent = translation.removeBtn;
  });
  
  // 更新无域名提示
  const exclusionList = document.getElementById('exclusion-list');
  if (exclusionList.innerHTML.includes('暂无黑名单域名') || exclusionList.innerHTML.includes('No blacklisted domains')) {
    exclusionList.innerHTML = `<div style="color: #999; font-style: italic;">${translation.noDomains}</div>`;
  }
}

// 获取当前域名
function getCurrentDomain() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        const url = new URL(tabs[0].url);
        resolve(url.hostname);
      } else {
        resolve('');
      }
    });
  });
}

// 获取排除名单
function getExclusionList() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getExclusionList' }, (response) => {
      resolve(response.exclusionList || []);
    });
  });
}

// 添加到排除名单
function addToExclusionList(domain) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'addToExclusionList', domain }, (response) => {
      resolve(response.success);
    });
  });
}

// 从排除名单移除
function removeFromExclusionList(domain) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'removeFromExclusionList', domain }, (response) => {
      resolve(response.success);
    });
  });
}

// 渲染排除名单列表
async function renderExclusionList() {
  const exclusionList = await getExclusionList();
  const exclusionListElement = document.getElementById('exclusion-list');
  const lang = getSystemLanguage();
  const translation = translations[lang] || translations.en;
  
  if (exclusionList.length === 0) {
    exclusionListElement.innerHTML = `<div style="color: #999; font-style: italic;">${translation.noDomains}</div>`;
    return;
  }
  
  exclusionListElement.innerHTML = '';
  
  exclusionList.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'exclusion-item';
    item.innerHTML = `
      <span>${domain}</span>
      <button class="remove-btn" data-domain="${domain}" title="${translation.removeBtn}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
    `;
    exclusionListElement.appendChild(item);
  });
  
  // 绑定移除按钮事件
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const domain = e.target.dataset.domain;
      await removeFromExclusionList(domain);
      await renderExclusionList();
      await updateToggleState();
    });
  });
}

// 更新 toggle 状态
async function updateToggleState() {
  const currentDomain = await getCurrentDomain();
  const exclusionList = await getExclusionList();
  const toggle = document.getElementById('exclusion-toggle');
  
  toggle.checked = exclusionList.includes(currentDomain);
}

// 初始化
async function init() {
  const currentDomain = await getCurrentDomain();
  document.getElementById('current-domain').textContent = currentDomain;
  
  updateLanguage();
  await renderExclusionList();
  await updateToggleState();
  
  // 绑定 toggle 事件
  document.getElementById('exclusion-toggle').addEventListener('change', async (e) => {
    const currentDomain = await getCurrentDomain();
    if (e.target.checked) {
      await addToExclusionList(currentDomain);
    } else {
      await removeFromExclusionList(currentDomain);
    }
    await renderExclusionList();
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}