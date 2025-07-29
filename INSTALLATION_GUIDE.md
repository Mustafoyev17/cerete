# 📱 Instagram Data Extractor - O'rnatish Ko'rsatmalari

## ⚠️ **MUHIM OGOHLANTIRISH**
Bu dasturlar faqat **o'zingizning telefoningiz** uchun! Boshqalarning ma'lumotlarini olish **qonunga zid**!

---

## 🛠️ **Kerakli Dasturlar**

### **Android uchun:**
```bash
# ADB o'rnatish
sudo apt-get install android-tools-adb

# Frida o'rnatish
pip install frida-tools

# Python kutubxonalari
pip install scapy
```

### **iOS uchun:**
```bash
# libimobiledevice o'rnatish
brew install libimobiledevice

# Python kutubxonalari
pip install scapy
```

### **Umumiy dasturlar:**
```bash
# Burp Suite Community Edition
# OWASP ZAP
# Wireshark
```

---

## 📋 **O'rnatish Qadamlari**

### **1. Android uchun:**

#### **A) ADB orqali:**
```bash
# 1. USB debugging yoqing
# Settings > Developer options > USB debugging

# 2. Telefoni ulang
adb devices

# 3. Scriptni ishga tushiring
chmod +x android-data-extractor/adb-extract.sh
./android-data-extractor/adb-extract.sh
```

#### **B) Frida orqali:**
```bash
# 1. Frida server o'rnating
adb push frida-server /data/local/tmp/
adb shell "chmod 755 /data/local/tmp/frida-server"
adb shell "/data/local/tmp/frida-server &"

# 2. Scriptni ishga tushiring
frida -U -l android-data-extractor/frida-script.js com.instagram.android
```

### **2. iOS uchun:**

#### **A) libimobiledevice orqali:**
```bash
# 1. iPhone'ni ulang va ishonchli qiling
idevice_id -l

# 2. Scriptni ishga tushiring
python3 ios-data-extractor/ios-extract.py
```

#### **B) Network interceptor orqali:**
```bash
# 1. Proxy o'rnating
# iPhone Settings > Wi-Fi > Network > Configure Proxy

# 2. Scriptni ishga tushiring
python3 advanced-extractors/network-interceptor.py
```

---

## 🔧 **Qo'shimcha Usullar**

### **1. Burp Suite orqali:**
1. Burp Suite o'rnating
2. Proxy sozlamalarini o'rnating
3. CA sertifikatini telefonga o'rnating
4. Instagram ilovasini oching
5. Trafikni kuzating

### **2. Wireshark orqali:**
```bash
# Instagram trafikini filtrlash
tcp.port == 443 and (ip.addr == api.instagram.com or ip.addr == i.instagram.com)
```

### **3. OWASP ZAP orqali:**
1. ZAP o'rnating
2. Proxy sozlamalarini o'rnating
3. SSL sertifikatini o'rnating
4. Instagram trafikini kuzating

---

## 📊 **Natijalarni Tahlil Qilish**

### **1. Backup fayllarini ochish:**
```bash
# Android backup
( printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" ; tail -c +25 instagram-backup.ab ) | tar xfvz -

# iOS backup
idevicebackup2 backup --extract
```

### **2. Database fayllarini ochish:**
```bash
# SQLite database
sqlite3 instagram.db
.tables
SELECT * FROM users;
```

### **3. Keychain ma'lumotlarini ochish:**
```bash
# iOS keychain
security find-internet-password -s instagram.com
```

---

## 🚨 **Xavfsizlik Choralari**

### **1. O'zingizning telefoningizda ishlating**
### **2. Natijalarni xavfsiz saqlang**
### **3. Boshqalarga bermang**
### **4. Qonuniy chegaralarni saqlang**

---

## 📞 **Yordam**

Agar muammo bo'lsa:
1. USB debugging yoqilganini tekshiring
2. Telefon ulanganini tekshiring
3. Ruxsatlar berilganini tekshiring
4. Dasturlar to'g'ri o'rnatilganini tekshiring

---

## ⚖️ **Qonuniy Eslatma**

Bu dasturlar faqat:
- ✅ O'zingizning qurilmangizda
- ✅ O'qish maqsadida
- ✅ Xavfsizlik sinovlari uchun

**Qonunga zid ishlatish taqiqlanadi!** 