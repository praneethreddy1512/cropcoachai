
// script to test the deployed backend API
const BASE_URL = "https://cropcoachai.onrender.com";

async function testApi() {
  console.log("Starting API Health Check on " + BASE_URL);
  
  const cookieJar = {
    cookies: [],
    add(setCookieHeader) {
      if (!setCookieHeader) return;
      if (Array.isArray(setCookieHeader)) {
        setCookieHeader.forEach(c => this.cookies.push(c.split(';')[0]));
      } else {
        this.cookies.push(setCookieHeader.split(';')[0]);
      }
    },
    get() {
      return this.cookies.join('; ');
    }
  };

  try {
    // 1. Test Public Endpoint
    console.log("\n1. Testing Public Endpoint (GET /api/news)...");
    const newsRes = await fetch(`${BASE_URL}/api/news?language=en&state=maharashtra`);
    console.log(`Status: ${newsRes.status}`);
    if (newsRes.ok) {
      const data = await newsRes.json();
      console.log(`Success! Retrieved ${Array.isArray(data) ? data.length : 0} news items.`);
    } else {
      console.log("Failed to fetch news.");
    }

    // 2. Register Test User
    const username = `test_user_${Date.now()}`;
    const password = "password123";
    console.log(`\n2. Registering Test User (${username})...`);
    
    const registerRes = await fetch(`${BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        fullName: "Test User",
        state: "maharashtra",
        district: "pune",
        preferredLanguage: "en"
      })
    });
    
    console.log(`Status: ${registerRes.status}`);
    // Capture cookies if any (some auth systems set cookie on register)
    const registerCookies = registerRes.headers.get('set-cookie');
    if (registerCookies) cookieJar.add(registerCookies);

    if (registerRes.ok) {
      console.log("Registration Successful.");
    } else {
      const text = await registerRes.text();
      console.log(`Registration Failed: ${text}`);
      // Proceeding might be impossible if register fails, but let's try login just in case
    }

    // 3. Login
    console.log("\n3. Logging in...");
    const loginRes = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    
    console.log(`Status: ${loginRes.status}`);
    const loginCookies = loginRes.headers.get('set-cookie');
    if (loginCookies) {
        cookieJar.add(loginCookies);
        console.log("Session cookie received.");
    } else {
        console.warn("No 'set-cookie' header received on login.");
    }

    if (loginRes.ok) {
      console.log("Login Successful.");
      
      // 4. Test Protected Route (User Profile)
      console.log("\n4. Testing Protected Route (GET /api/user)...");
      const userRes = await fetch(`${BASE_URL}/api/user`, {
        headers: { "Cookie": cookieJar.get() }
      });
      console.log(`Status: ${userRes.status}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        console.log("User Profile Verified: " + userData.username);
      } else {
        console.log("Failed to fetch user profile.");
      }

      // 5. Test Dashboard (Protected)
      console.log("\n5. Testing Dashboard (GET /api/dashboard)...");
       const dashRes = await fetch(`${BASE_URL}/api/dashboard`, {
        headers: { "Cookie": cookieJar.get() }
      });
      console.log(`Status: ${dashRes.status}`);
      if (dashRes.ok) {
        console.log("Dashboard Endpoint Working.");
      } else {
        console.log("Failed to access dashboard.");
      }

    } else {
      console.log("Login Failed. Skipping auth-dependent tests.");
    }

  } catch (err) {
    console.error("Test Script Error:", err);
  }
}

testApi();
