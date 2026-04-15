// 初始化黑名单存储
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ blacklist: [] });
});

// 处理来自 popup 和 content script 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getBlacklist':
      chrome.storage.local.get('blacklist', (result) => {
        sendResponse({ blacklist: result.blacklist || [] });
      });
      return true;
    
    case 'addToBlacklist':
      chrome.storage.local.get('blacklist', (result) => {
        const blacklist = result.blacklist || [];
        if (!blacklist.includes(message.domain)) {
          blacklist.push(message.domain);
          chrome.storage.local.set({ blacklist }, () => {
            sendResponse({ success: true });
          });
        } else {
          sendResponse({ success: false, message: 'Domain already in blacklist' });
        }
      });
      return true;
    
    case 'removeFromBlacklist':
      chrome.storage.local.get('blacklist', (result) => {
        const blacklist = result.blacklist || [];
        const updatedBlacklist = blacklist.filter(domain => domain !== message.domain);
        chrome.storage.local.set({ blacklist: updatedBlacklist }, () => {
          sendResponse({ success: true });
        });
      });
      return true;
    
    case 'checkBlacklist':
      chrome.storage.local.get('blacklist', (result) => {
        const blacklist = result.blacklist || [];
        const isBlacklisted = blacklist.some(domain => message.url.includes(domain));
        sendResponse({ isBlacklisted });
      });
      return true;
  }
});