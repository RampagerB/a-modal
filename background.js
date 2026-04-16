// 初始化排除名单存储
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ exclusionList: [] });
});

// 处理来自 popup 和 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getExclusionList':
      chrome.storage.local.get('exclusionList', (result) => {
        sendResponse({ exclusionList: result.exclusionList || [] });
      });
      return true;
    
    case 'addToExclusionList':
      chrome.storage.local.get('exclusionList', (result) => {
        const exclusionList = result.exclusionList || [];
        if (!exclusionList.includes(message.domain)) {
          exclusionList.push(message.domain);
          chrome.storage.local.set({ exclusionList }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ success: false, message: 'Domain already in exclusion list' });
        }
      });
      return true;
    
    case 'removeFromExclusionList':
      chrome.storage.local.get('exclusionList', (result) => {
        const exclusionList = result.exclusionList || [];
        const updatedExclusionList = exclusionList.filter(domain => domain !== message.domain);
        chrome.storage.local.set({ exclusionList: updatedExclusionList }, () => {
          sendResponse({ success: true });
        });
      });
      return true;
    
    case 'checkExclusionList':
      chrome.storage.local.get('exclusionList', (result) => {
        const exclusionList = result.exclusionList || [];
        const isExcluded = exclusionList.some(domain => message.url.includes(domain));
        sendResponse({ isExcluded });
      });
      return true;
  }
});