# **Redis - From Basics to Advanced**

## **Table of Contents**
- [Introduction](#introduction)
- [Installation](#installation)
- [Basic Commands](#basic-commands)
- [Data Types & Operations](#data-types--operations)
- [Configuration & Setup](#configuration--setup)
- [Advanced Use Cases](#advanced-use-cases)
- [Performance Tuning](#performance-tuning)
- [Security Best Practices](#security-best-practices)
- [Cluster & Replication](#cluster--replication)
- [Useful Redis Packages in Node.js](#useful-redis-packages-in-nodejs)
- [Conclusion](#conclusion)

---

## **Introduction**
Redis (Remote Dictionary Server) is an open-source, in-memory key-value store that supports different data structures such as strings, hashes, lists, sets, and more. It is widely used for caching, real-time analytics, session management, and message brokering.

---

## **Installation**

### **Linux & macOS**
```sh
sudo apt update && sudo apt install redis-server -y   # Ubuntu/Debian
brew install redis                                    # macOS
```

### **Windows**
- Use **WSL (Windows Subsystem for Linux)** or install Redis from [Memurai](https://www.memurai.com/) or [Redis for Windows](https://github.com/microsoftarchive/redis/releases).

### **Verify Installation**
```sh
redis-server --version
redis-cli ping  # Response: PONG
```

---

## **Basic Commands**

| Command | Description |
|---------|-------------|
| `SET key value` | Store a value |
| `GET key` | Retrieve a value |
| `DEL key` | Delete a key |
| `EXPIRE key seconds` | Set expiry time |
| `TTL key` | Check expiry time |
| `INCR key` | Increment value |
| `DECR key` | Decrement value |
| `FLUSHALL` | Delete all data |

---

## **Data Types & Operations**

### **1. String**
```sh
SET name "Alice"
GET name
```

### **2. List**
```sh
LPUSH users "Alice" "Bob"
LRANGE users 0 -1
```

### **3. Hash**
```sh
HSET user:1 name "Alice" age 25
HGETALL user:1
```

### **4. Set (Unique Values)**
```sh
SADD cities "New York" "London" "New York"
SMEMBERS cities
```

### **5. Sorted Set (Leaderboard)**
```sh
ZADD leaderboard 100 "Alice" 200 "Bob"
ZRANGE leaderboard 0 -1 WITHSCORES
```

---

## **Configuration & Setup**

- **Redis Config File Location**: `/etc/redis/redis.conf`
- **Set max memory usage:**
  ```sh
  maxmemory 100mb
  maxmemory-policy allkeys-lru
  ```
- **Enable Redis as a service (Linux):**
  ```sh
  sudo systemctl enable redis && sudo systemctl start redis
  ```

---

## **Advanced Use Cases**

### **1. Caching Data**
```js
const Redis = require("ioredis");
const redis = new Redis();
async function cacheData(key, value) {
  await redis.set(key, JSON.stringify(value), "EX", 3600);
}
async function getCachedData(key) {
  return JSON.parse(await redis.get(key));
}
```

### **2. Session Storage**
```js
const session = require("express-session");
const RedisStore = require("connect-redis").default;
const redisClient = new Redis();
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: "secret_key",
  resave: false,
  saveUninitialized: false,
}));
```

### **3. Rate Limiting (API Protection)**
```js
async function rateLimit(userId) {
  const key = `rate_limit:${userId}`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  return count <= 5;
}
```

### **4. Pub/Sub (Real-Time Communication)**
```js
const subscriber = new Redis();
subscriber.subscribe("news");
subscriber.on("message", (channel, message) => {
  console.log(`Received: ${message}`);
});
```

### **5. Task Queues (Background Jobs)**
```js
const Queue = require("bull");
const jobQueue = new Queue("email_jobs", { redis: { host: "127.0.0.1", port: 6379 } });
jobQueue.process(async (job) => console.log("Processing job:", job.data));
```

---

## **Performance Tuning**
- Use `LRU (Least Recently Used)` caching policy.
- Enable `Persistence (RDB/AOF)` for data durability.
- Optimize **maxmemory** settings in `redis.conf`.

---

## **Security Best Practices**
- Bind Redis to `localhost` in `/etc/redis/redis.conf`:
  ```sh
  bind 127.0.0.1
  ```
- Set a strong password:
  ```sh
  requirepass "your_password"
  ```
- Use firewall rules to restrict access:
  ```sh
  sudo ufw allow from 192.168.1.100 to any port 6379
  ```

---

## **Cluster & Replication**

### **Enable Redis Replication**
- **Master Configuration:**
  ```sh
  bind 127.0.0.1
  ```
- **Slave Configuration:**
  ```sh
  slaveof 127.0.0.1 6379
  ```

### **Setup Redis Cluster**
```sh
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 --cluster-replicas 1
```

---

## **Useful Redis Packages in Node.js**
| Package | Description |
|---------|-------------|
| `ioredis` | Recommended Redis client for Node.js |
| `redis` | Lightweight Redis package |
| `connect-redis` | Session storage for Express |
| `bull` | Background job processing |
| `socket.io-redis` | Pub/Sub communication |

---

