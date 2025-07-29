#!/usr/bin/env python3
"""
iOS Instagram Data Extractor (Educational Purpose Only)
Bu faqat o'zingizning iPhone'ingiz uchun!
"""

import subprocess
import json
import os
import sys

def run_command(cmd):
    """Komandani ishga tushirish"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout, result.stderr
    except Exception as e:
        print(f"Xatolik: {e}")
        return None, None

def check_ios_device():
    """iOS qurilmani tekshirish"""
    print("=== iOS Instagram Data Extractor ===")
    print("Bu faqat o'zingizning iPhone'ingiz uchun!")
    
    # iOS qurilmani topish
    stdout, stderr = run_command("idevice_id -l")
    if not stdout.strip():
        print("❌ iOS qurilma topilmadi!")
        print("iPhone'ni USB orqali ulang va ishonchli qurilma sifatida tanlang")
        return False
    
    device_id = stdout.strip().split('\n')[0]
    print(f"✅ iOS qurilma topildi: {device_id}")
    return device_id

def extract_instagram_data(device_id):
    """Instagram ma'lumotlarini olish"""
    print("\n1. Instagram ilovasining ma'lumotlarini olish...")
    
    # Instagram ilovasini topish
    stdout, stderr = run_command(f"ideviceinstaller -l")
    if "Instagram" not in stdout:
        print("❌ Instagram ilovasi topilmadi!")
        return False
    
    print("✅ Instagram ilovasi topildi")
    
    # Ilova ma'lumotlarini nusxalash
    print("\n2. Ilova ma'lumotlarini nusxalash...")
    
    # Backup yaratish
    backup_cmd = f"idevicebackup2 backup --extract"
    stdout, stderr = run_command(backup_cmd)
    
    if stderr and "error" in stderr.lower():
        print(f"❌ Backup xatosi: {stderr}")
        return False
    
    print("✅ Backup yaratildi")
    
    # Instagram ma'lumotlarini qidirish
    print("\n3. Instagram ma'lumotlarini qidirish...")
    
    # Keychain ma'lumotlarini olish
    keychain_cmd = f"idevicebackup2 backup --extract --keychain"
    stdout, stderr = run_command(keychain_cmd)
    
    if stdout:
        print("✅ Keychain ma'lumotlari topildi")
        # Keychain ma'lumotlarini saqlash
        with open("instagram_keychain.txt", "w") as f:
            f.write(stdout)
    
    # App data ni qidirish
    app_data_cmd = "find . -name '*instagram*' -type f"
    stdout, stderr = run_command(app_data_cmd)
    
    if stdout:
        print("✅ Instagram app data topildi:")
        for line in stdout.split('\n'):
            if line.strip():
                print(f"   {line}")
    
    return True

def analyze_extracted_data():
    """Olingan ma'lumotlarni tahlil qilish"""
    print("\n4. Ma'lumotlarni tahlil qilish...")
    
    # Keychain ma'lumotlarini o'qish
    if os.path.exists("instagram_keychain.txt"):
        print("📱 Keychain ma'lumotlari:")
        with open("instagram_keychain.txt", "r") as f:
            content = f.read()
            # Email va parol ma'lumotlarini qidirish
            lines = content.split('\n')
            for line in lines:
                if any(keyword in line.lower() for keyword in ['email', 'password', 'username', 'login']):
                    print(f"   {line}")
    
    # Plist fayllarini qidirish
    plist_cmd = "find . -name '*.plist' -exec grep -l 'password\\|email\\|username' {} \\;"
    stdout, stderr = run_command(plist_cmd)
    
    if stdout:
        print("\n📱 Plist fayllarida ma'lumotlar:")
        for line in stdout.split('\n'):
            if line.strip():
                print(f"   {line}")
    
    # SQLite database larni qidirish
    sqlite_cmd = "find . -name '*.sqlite' -o -name '*.db'"
    stdout, stderr = run_command(sqlite_cmd)
    
    if stdout:
        print("\n📱 Database fayllar:")
        for line in stdout.split('\n'):
            if line.strip():
                print(f"   {line}")

def main():
    """Asosiy funksiya"""
    print("🔒 Bu dastur faqat o'zingizning iPhone'ingiz uchun!")
    print("⚠️  Boshqalarning ma'lumotlarini olish qonunga zid!")
    
    # iOS qurilmani tekshirish
    device_id = check_ios_device()
    if not device_id:
        return
    
    # Instagram ma'lumotlarini olish
    if extract_instagram_data(device_id):
        analyze_extracted_data()
        print("\n✅ Ma'lumotlar muvaffaqiyatli olingan!")
        print("📁 Natijalar joriy papkada saqlandi")
    else:
        print("\n❌ Ma'lumotlarni olishda xatolik yuz berdi")

if __name__ == "__main__":
    main() 