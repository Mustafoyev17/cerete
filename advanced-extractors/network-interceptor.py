#!/usr/bin/env python3
"""
Network Interceptor - Instagram App Traffic (Educational Purpose Only)
Bu faqat o'zingizning telefoningiz uchun!
"""

import subprocess
import json
import time
import os
from scapy.all import *

def setup_proxy():
    """Proxy o'rnatish"""
    print("=== Network Interceptor ===")
    print("Bu faqat o'zingizning telefoningiz uchun!")
    
    # Burp Suite yoki OWASP ZAP proxy o'rnatish
    print("\n1. Proxy o'rnatish...")
    
    # Android uchun
    print("Android uchun:")
    print("adb shell settings put global http_proxy 192.168.1.100:8080")
    
    # iOS uchun
    print("\niOS uchun:")
    print("iPhone Settings > Wi-Fi > Network > Configure Proxy > Manual")
    print("Server: 192.168.1.100")
    print("Port: 8080")
    
    return True

def capture_instagram_traffic():
    """Instagram trafikini ushlash"""
    print("\n2. Instagram trafikini ushlash...")
    
    # Instagram API endpoints
    instagram_endpoints = [
        "api.instagram.com",
        "i.instagram.com",
        "graph.instagram.com"
    ]
    
    def packet_handler(packet):
        if packet.haslayer(IP) and packet.haslayer(TCP):
            src_ip = packet[IP].src
            dst_ip = packet[IP].dst
            payload = packet[TCP].payload
            
            # Instagram trafikini filtrlash
            for endpoint in instagram_endpoints:
                if endpoint in str(payload):
                    print(f"\n[+] Instagram trafik ushladi:")
                    print(f"   Manba: {src_ip}")
                    print(f"   Manzil: {dst_ip}")
                    print(f"   Ma'lumot: {payload}")
                    
                    # Ma'lumotlarni faylga saqlash
                    with open("instagram_traffic.txt", "a") as f:
                        f.write(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
                        f.write(f"Source: {src_ip}\n")
                        f.write(f"Destination: {dst_ip}\n")
                        f.write(f"Data: {payload}\n")
                        f.write("-" * 50 + "\n")
    
    # Trafikni ushlash
    print("Instagram trafikini ushlash boshlandi...")
    print("Instagram ilovasini oching va login qiling...")
    
    try:
        sniff(filter="tcp and (host api.instagram.com or host i.instagram.com)", 
              prn=packet_handler, 
              timeout=300)  # 5 daqiqa
    except KeyboardInterrupt:
        print("\nTrafik ushlash to'xtatildi")

def analyze_captured_data():
    """Ushlangan ma'lumotlarni tahlil qilish"""
    print("\n3. Ushlangan ma'lumotlarni tahlil qilish...")
    
    if os.path.exists("instagram_traffic.txt"):
        with open("instagram_traffic.txt", "r") as f:
            content = f.read()
            
            # Login ma'lumotlarini qidirish
            login_patterns = [
                "username",
                "password", 
                "email",
                "login",
                "auth"
            ]
            
            print("📱 Login ma'lumotlari:")
            lines = content.split('\n')
            for line in lines:
                for pattern in login_patterns:
                    if pattern in line.lower():
                        print(f"   {line}")
                        break

def mitm_attack():
    """Man-in-the-Middle hujum"""
    print("\n4. MITM hujum (faqat o'zingizning telefoningiz uchun!)")
    
    # SSL/TLS sertifikatini o'rnatish
    print("SSL sertifikatini o'rnatish:")
    print("1. Burp Suite yoki OWASP ZAP o'rnating")
    print("2. CA sertifikatini yuklab oling")
    print("3. Telefonga o'rnating")
    
    # Android uchun
    print("\nAndroid uchun:")
    print("Settings > Security > Install from storage > CA sertifikatini tanlang")
    
    # iOS uchun  
    print("\niOS uchun:")
    print("Settings > General > About > Certificate Trust Settings > CA sertifikatini yoqing")

def main():
    """Asosiy funksiya"""
    print("🔒 Bu dastur faqat o'zingizning telefoningiz uchun!")
    print("⚠️  Boshqalarning ma'lumotlarini olish qonunga zid!")
    
    while True:
        print("\n=== Instagram Data Extractor ===")
        print("1. Proxy o'rnatish")
        print("2. Trafik ushlash")
        print("3. Ma'lumotlarni tahlil qilish")
        print("4. MITM hujum")
        print("5. Chiqish")
        
        choice = input("\nTanlang (1-5): ")
        
        if choice == "1":
            setup_proxy()
        elif choice == "2":
            capture_instagram_traffic()
        elif choice == "3":
            analyze_captured_data()
        elif choice == "4":
            mitm_attack()
        elif choice == "5":
            print("Dastur tugatildi")
            break
        else:
            print("Noto'g'ri tanlov!")

if __name__ == "__main__":
    main() 