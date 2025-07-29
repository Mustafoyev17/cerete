#!/bin/bash

echo "=== Instagram Data Extractor (Educational Purpose Only) ==="
echo "Bu faqat o'zingizning telefoningiz uchun!"

# ADB orqali Instagram ilovasining ma'lumotlarini olish
echo "1. Instagram ilovasining ma'lumotlarini olish..."

# Instagram package nomini topish
PACKAGE_NAME=$(adb shell pm list packages | grep instagram)

if [ -z "$PACKAGE_NAME" ]; then
    echo "Instagram ilovasi topilmadi!"
    exit 1
fi

echo "Instagram package: $PACKAGE_NAME"

# Ilova ma'lumotlarini nusxalash
echo "2. Ilova ma'lumotlarini nusxalash..."
adb backup -f instagram-backup.ab -apk com.instagram.android

# Backup faylini ochish
echo "3. Backup faylini ochish..."
( printf "\x1f\x8b\x08\x00\x00\x00\x00\x00" ; tail -c +25 instagram-backup.ab ) | tar xfvz -

echo "4. Ma'lumotlarni qidirish..."
# Shared preferences fayllarini qidirish
find . -name "*.xml" -exec grep -l "password\|email\|username" {} \;

# Database fayllarini qidirish
find . -name "*.db" -o -name "*.sqlite" | head -10

echo "=== Natija ==="
echo "Ma'lumotlar 'instagram-backup.ab' faylida saqlandi"
echo "Bu faylni tahlil qilish uchun maxsus dasturlar kerak" 