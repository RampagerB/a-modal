// 语言配置
const translations = {
  en: {
    extensionTitle: "Modal Link Opener",
    domainLabel: "Current domain:",
    toggleLabel: "Add to blacklist",
    listTitle: "Blacklisted domains",
    noDomains: "No blacklisted domains",
    removeBtn: "Remove"
  },
  zh: {
    extensionTitle: "Modal 链接 opener",
    domainLabel: "当前域名:",
    toggleLabel: "添加到黑名单",
    listTitle: "黑名单域名",
    noDomains: "暂无黑名单域名",
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
  const blacklistList = document.getElementById('whitelist-list');
  if (blacklistList.innerHTML.includes('暂无黑名单域名') || blacklistList.innerHTML.includes('No blacklisted domains')) {
    blacklistList.innerHTML = `<div style="color: #999; font-style: italic;">${translation.noDomains}</div>`;
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

// 获取黑名单
function getBlacklist() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'getBlacklist' }, (response) => {
      resolve(response.blacklist || []);
    });
  });
}

// 添加到黑名单
function addToBlacklist(domain) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'addToBlacklist', domain }, (response) => {
      resolve(response.success);
    });
  });
}

// 从黑名单移除
function removeFromBlacklist(domain) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: 'removeFromBlacklist', domain }, (response) => {
      resolve(response.success);
    });
  });
}

// 渲染黑名单列表
async function renderBlacklist() {
  const blacklist = await getBlacklist();
  const blacklistList = document.getElementById('whitelist-list');
  const lang = getSystemLanguage();
  const translation = translations[lang] || translations.en;
  
  if (blacklist.length === 0) {
    blacklistList.innerHTML = `<div style="color: #999; font-style: italic;">${translation.noDomains}</div>`;
    return;
  }
  
  blacklistList.innerHTML = '';
  
  blacklist.forEach(domain => {
    const item = document.createElement('div');
    item.className = 'whitelist-item';
    item.innerHTML = `
      <span>${domain}</span>
      <button class="remove-btn" data-domain="${domain}" title="${translation.removeBtn}"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
    `;
    blacklistList.appendChild(item);
  });
  
  // 绑定移除按钮事件
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const domain = e.target.dataset.domain;
      await removeFromBlacklist(domain);
      await renderBlacklist();
      await updateToggleState();
    });
  });
}

// 更新 toggle 状态
async function updateToggleState() {
  const currentDomain = await getCurrentDomain();
  const blacklist = await getBlacklist();
  const toggle = document.getElementById('whitelist-toggle');
  
  toggle.checked = blacklist.includes(currentDomain);
}

// 初始化
async function init() {
  const currentDomain = await getCurrentDomain();
  document.getElementById('current-domain').textContent = currentDomain;
  
  updateLanguage();
  await renderBlacklist();
  await updateToggleState();
  
  // 绑定 toggle 事件
  document.getElementById('whitelist-toggle').addEventListener('change', async (e) => {
    const currentDomain = await getCurrentDomain();
    if (e.target.checked) {
      await addToBlacklist(currentDomain);
    } else {
      await removeFromBlacklist(currentDomain);
    }
    await renderBlacklist();
  });
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}