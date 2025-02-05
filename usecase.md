Here’s your content in Markdown format:  

```md
# **Use Cases of Redis & How to Achieve in Node.js**  

Redis is an in-memory key-value store widely used for caching, session management, real-time analytics, and more. Below are the most common use cases along with how to implement them in Node.js.

---

## **1. Caching (Improving Performance)**  
Used to store frequently accessed data to reduce database queries and improve response time.

### **Implementation in Node.js**  
Install Redis and connect with `ioredis` or `redis` package.

```sh
npm install ioredis
```

```js
const Redis = require("ioredis");
const redis = new Redis();

// Function to fetch data (cached or fresh)
async function getCachedData(key, fetchDataFn) {
  let data = await redis.get(key);
  if (data) {
    return JSON.parse(data);
  }
  data = await fetchDataFn(); // Fetch fresh data from DB or API
  await redis.set(key, JSON.stringify(data), "EX", 3600); // Cache for 1 hour
  return data;
}
```

---

## **2. Session Management**  
Used to store user sessions in Redis instead of a database, improving speed and scalability.

### **Implementation in Node.js**  
Install `connect-redis` for Express session storage.

```sh
npm install express-session connect-redis ioredis
```

```js
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const Redis = require("ioredis");

const redisClient = new Redis();
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "your_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 }, // 1 day
  })
);
```

---

## **3. Real-Time Analytics (Counting Events)**  
Redis is great for real-time analytics such as counting page views, likes, and visits.

### **Implementation in Node.js**  
```js
async function trackPageView(pageId) {
  await redis.incr(`page_views:${pageId}`);
}

async function getPageViews(pageId) {
  return await redis.get(`page_views:${pageId}`);
}
```

---

## **4. Rate Limiting (API Request Throttling)**  
Used to limit API requests per user/IP to prevent abuse.

### **Implementation in Node.js**  
```js
async function rateLimit(userId, limit = 10, expireTime = 60) {
  const key = `rate_limit:${userId}`;
  const requests = await redis.incr(key);

  if (requests === 1) {
    await redis.expire(key, expireTime); // Set expiry on first request
  }

  if (requests > limit) {
    return false; // Rate limit exceeded
  }
  return true; // Allowed
}

// Middleware example
app.use(async (req, res, next) => {
  const allowed = await rateLimit(req.ip, 5, 60);
  if (!allowed) return res.status(429).json({ error: "Rate limit exceeded" });
  next();
});
```

---

## **5. Message Queues (Pub/Sub for Real-Time Communication)**  
Used for event-driven architecture, chat applications, and notifications.

### **Implementation in Node.js**  
```js
// Publisher
async function publishMessage(channel, message) {
  await redis.publish(channel, JSON.stringify(message));
}

// Subscriber
const subscriber = new Redis();
subscriber.subscribe("news");
subscriber.on("message", (channel, message) => {
  console.log(`Received message on ${channel}:`, JSON.parse(message));
});
```

---

## **6. Distributed Locking (Preventing Concurrent Operations)**  
Useful for ensuring that only one instance of a process executes a critical section.

### **Implementation in Node.js**  
```js
async function acquireLock(resource, ttl = 5000) {
  const lock = await redis.set(resource, "locked", "NX", "PX", ttl);
  return lock ? true : false;
}

async function releaseLock(resource) {
  await redis.del(resource);
}

// Example
async function processJob(jobId) {
  if (!(await acquireLock(`job:${jobId}`, 10000))) {
    console.log("Job already being processed.");
    return;
  }
  try {
    console.log("Processing job...");
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } finally {
    await releaseLock(`job:${jobId}`);
  }
}
```

---

## **7. Leaderboards (Sorted Sets for Ranking)**  
Used in gaming applications to maintain leaderboards.

### **Implementation in Node.js**  
```js
async function addScore(userId, score) {
  await redis.zadd("leaderboard", score, userId);
}

async function getTopUsers(limit = 10) {
  return await redis.zrevrange("leaderboard", 0, limit - 1, "WITHSCORES");
}
```

---

## **8. Geo-Location Services**  
Store user locations and retrieve nearby users.

### **Implementation in Node.js**  
```js
async function addLocation(userId, lat, lon) {
  await redis.geoadd("users_location", lon, lat, userId);
}

async function getNearbyUsers(lat, lon, radius = 10, unit = "km") {
  return await redis.georadius("users_location", lon, lat, radius, unit, "WITHDIST");
}
```

---

## **9. Task Queues (Background Job Processing)**  
Used for scheduling background tasks.

### **Implementation in Node.js**  
Using `bull` package:

```sh
npm install bull
```

```js
const Queue = require("bull");
const jobQueue = new Queue("email_jobs", { redis: { host: "127.0.0.1", port: 6379 } });

// Producer
jobQueue.add({ email: "user@example.com", subject: "Welcome!" });

// Consumer
jobQueue.process(async (job) => {
  console.log("Processing job:", job.data);
});
```

---

## **10. Temporary Key Expiry (Auto-Expiring Tokens)**  
Used for OTP verification, password reset tokens.

### **Implementation in Node.js**  
```js
async function storeOTP(userId, otp) {
  await redis.set(`otp:${userId}`, otp, "EX", 300); // Expires in 5 min
}

async function verifyOTP(userId, otp) {
  const storedOtp = await redis.get(`otp:${userId}`);
  return storedOtp === otp;
}
```