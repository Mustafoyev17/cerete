// Frida Script - Instagram Data Interceptor (Educational Purpose Only)
// Bu faqat o'zingizning telefoningiz uchun!

console.log("[+] Instagram Data Interceptor yuklandi");

// Instagram ilovasining asosiy klasslarini topish
Java.perform(function() {
    console.log("[+] Java.perform ishga tushdi");
    
    // SharedPreferences ni intercept qilish
    try {
        var SharedPreferences = Java.use("android.content.SharedPreferences");
        
        SharedPreferences.getString.implementation = function(key, defValue) {
            var result = this.getString(key, defValue);
            if (key && (key.includes("password") || key.includes("email") || key.includes("username") || key.includes("login"))) {
                console.log("[+] SharedPreferences.getString intercepted:");
                console.log("    Key: " + key);
                console.log("    Value: " + result);
                console.log("    Default: " + defValue);
            }
            return result;
        };
        
        console.log("[+] SharedPreferences interceptor o'rnatildi");
    } catch (e) {
        console.log("[-] SharedPreferences interceptor xatosi: " + e);
    }
    
    // SQLite database ni intercept qilish
    try {
        var SQLiteDatabase = Java.use("android.database.sqlite.SQLiteDatabase");
        
        SQLiteDatabase.rawQuery.implementation = function(sql, selectionArgs) {
            var result = this.rawQuery(sql, selectionArgs);
            if (sql && (sql.toLowerCase().includes("password") || sql.toLowerCase().includes("email") || sql.toLowerCase().includes("user"))) {
                console.log("[+] SQLiteDatabase.rawQuery intercepted:");
                console.log("    SQL: " + sql);
                console.log("    Args: " + selectionArgs);
            }
            return result;
        };
        
        console.log("[+] SQLiteDatabase interceptor o'rnatildi");
    } catch (e) {
        console.log("[-] SQLiteDatabase interceptor xatosi: " + e);
    }
    
    // HTTP requests ni intercept qilish
    try {
        var OkHttpClient = Java.use("okhttp3.OkHttpClient");
        
        OkHttpClient.newCall.implementation = function(request) {
            var result = this.newCall(request);
            var url = request.url().toString();
            if (url.includes("instagram.com") || url.includes("login") || url.includes("auth")) {
                console.log("[+] HTTP Request intercepted:");
                console.log("    URL: " + url);
                console.log("    Method: " + request.method());
                console.log("    Headers: " + request.headers());
            }
            return result;
        };
        
        console.log("[+] OkHttpClient interceptor o'rnatildi");
    } catch (e) {
        console.log("[-] OkHttpClient interceptor xatosi: " + e);
    }
    
    // Instagram'ning o'z klasslarini topish
    try {
        Java.enumerateLoadedClasses({
            onMatch: function(className) {
                if (className.includes("instagram") || className.includes("Instagram")) {
                    console.log("[+] Instagram class found: " + className);
                }
            },
            onComplete: function() {
                console.log("[+] Class enumeration tugadi");
            }
        });
    } catch (e) {
        console.log("[-] Class enumeration xatosi: " + e);
    }
});

// Native functions ni intercept qilish
Interceptor.attach(Module.findExportByName("libc.so", "strcmp"), {
    onEnter: function(args) {
        var str1 = Memory.readCString(args[0]);
        var str2 = Memory.readCString(args[1]);
        
        if (str1 && str2 && (str1.includes("password") || str1.includes("email") || str2.includes("password") || str2.includes("email"))) {
            console.log("[+] Native strcmp intercepted:");
            console.log("    String1: " + str1);
            console.log("    String2: " + str2);
        }
    }
});

console.log("[+] Instagram Data Interceptor to'liq yuklandi"); 