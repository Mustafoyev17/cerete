// Popup script for Instagram Data Collector
document.addEventListener('DOMContentLoaded', function() {
  const collectBtn = document.getElementById('collectBtn');
  const checkBtn = document.getElementById('checkBtn');
  const status = document.getElementById('status');

  // Check if Instagram tab is open
  checkBtn.addEventListener('click', function() {
    chrome.tabs.query({url: "*://*.instagram.com/*"}, function(tabs) {
      if (tabs.length > 0) {
        status.innerHTML = `<div class="success">Instagram sahifasi topildi: ${tabs.length} ta tab</div>`;
      } else {
        status.innerHTML = `<div class="error">Instagram sahifasi topilmadi. Instagram.com ga o'ting.</div>`;
      }
    });
  });

  // Collect data from Instagram
  collectBtn.addEventListener('click', function() {
    chrome.tabs.query({url: "*://*.instagram.com/*"}, function(tabs) {
      if (tabs.length > 0) {
        // Send message to content script
        chrome.tabs.sendMessage(tabs[0].id, {action: 'collectData'}, function(response) {
          if (response) {
            status.innerHTML = `<div class="success">Ma'lumotlar to'plandı va yuborildi!</div>`;
          } else {
            status.innerHTML = `<div class="error">Ma'lumotlarni to'plashda xatolik yuz berdi.</div>`;
          }
        });
      } else {
        status.innerHTML = `<div class="error">Instagram sahifasi topilmadi. Instagram.com ga o'ting.</div>`;
      }
    });
  });
}); 