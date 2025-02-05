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

# 📌 **All Redis Data Types and Their CRUD Operations (With Node.js Code Example)**

Redis is an **In-Memory Data Store** used for high-speed data access. It supports various data types for storing and managing data. Here are the **CRUD (Create, Read, Update, Delete) operations for all Redis data types** explained with **Node.js code**.

---

## 🔹 **First, Set Up Redis in Node.js**  
### 1️⃣ **Install Redis and Node.js**  
First, install **Redis** and **Node.js**. Then, install the `redis` package:  
```sh
npm install redis
```

### 2️⃣ **Connect to Redis Client**  
```js
const redis = require("redis");
const client = redis.createClient();

client.on("connect", () => console.log("✅ Connected to Redis!"));
client.on("error", (err) => console.log("❌ Redis Error: ", err));

client.connect(); // Redis v4 syntax
```

---

# 📌 **1. String (String)**
## ✅ **CRUD Operations**
```js
// CREATE & UPDATE
await client.set("name", "Awdhesh"); 

// READ
const name = await client.get("name");
console.log("Name:", name); // Output: Awdhesh

// DELETE
await client.del("name");
console.log("Deleted name!");
```

---

# 📌 **2. List (List)**
## ✅ **CRUD Operations**
```js
// CREATE (LPUSH - Add to the start, RPUSH - Add to the end)
await client.lPush("tasks", "Task1", "Task2", "Task3");

// READ (Get the list)
const tasks = await client.lRange("tasks", 0, -1);
console.log("Tasks:", tasks); // Output: ["Task3", "Task2", "Task1"]

// UPDATE (Set by index)
await client.lSet("tasks", 1, "Updated Task2");

// DELETE (LPOP - Remove from the start, RPOP - Remove from the end)
await client.lPop("tasks");
console.log("Deleted first task!");
```

---

# 📌 **3. Set (Set - Unique Values)**
## ✅ **CRUD Operations**
```js
// CREATE
await client.sAdd("colors", "Red", "Blue", "Green");

// READ
const colors = await client.sMembers("colors");
console.log("Colors:", colors); // Output: ["Red", "Blue", "Green"]

// UPDATE (Remove first, then add)
await client.sRem("colors", "Blue");
await client.sAdd("colors", "Yellow");

// DELETE (Remove all values)
await client.del("colors");
console.log("Deleted all colors!");
```

---

# 📌 **4. Sorted Set (Sorted Set)**
## ✅ **CRUD Operations**
```js
// CREATE (ZADD - Add with score)
await client.zAdd("scores", [
  { score: 100, value: "Player1" },
  { score: 200, value: "Player2" }
]);

// READ (Get by score)
const scores = await client.zRangeWithScores("scores", 0, -1);
console.log("Scores:", scores);

// UPDATE (Update score)
await client.zIncrBy("scores", 50, "Player1");

// DELETE (Remove a player)
await client.zRem("scores", "Player2");

// DELETE (Remove entire data)
await client.del("scores");
```

---

# 📌 **5. Hash (Hash - Key-Value Pairs)**
## ✅ **CRUD Operations**
```js
// CREATE
await client.hSet("user:1", { name: "Awdhesh", age: 22 });

// READ
const user = await client.hGetAll("user:1");
console.log("User:", user); // Output: { name: "Awdhesh", age: "22" }

// UPDATE
await client.hSet("user:1", "age", 23);

// DELETE (Remove a field)
await client.hDel("user:1", "age");

// DELETE (Remove entire data)
await client.del("user:1");
```

---

# 📌 **6. Bitmaps (Bitmaps - Binary Data)**
## ✅ **CRUD Operations**
```js
// CREATE & UPDATE (Set a bit)
await client.setBit("attendance", 1, 1);

// READ (Check the bit)
const bit = await client.getBit("attendance", 1);
console.log("Attendance:", bit); // Output: 1

// DELETE (Remove entire data)
await client.del("attendance");
```

---

# 📌 **7. HyperLogLog (HyperLogLog - Approximate Counting)**
## ✅ **CRUD Operations**
```js
// CREATE
await client.pfAdd("unique_users", "User1", "User2", "User3");

// READ (Get count)
const count = await client.pfCount("unique_users");
console.log("Unique Users:", count); 

// DELETE (Remove entire data)
await client.del("unique_users");
```

---

# 📌 **8. Streams (Streams - Real-time Data)**
## ✅ **CRUD Operations**
```js
// CREATE (XADD - Add data to the stream)
await client.xAdd("mystream", "*", { user: "Awdhesh", message: "Hello Redis!" });

// READ (XRANGE - Read the data)
const messages = await client.xRange("mystream", "-", "+");
console.log("Messages:", messages);

// DELETE (Remove the stream)
await client.del("mystream");
```

---

# 🎯 **Conclusion**
Redis is a **fast and powerful NoSQL data store** that supports various data types for storing and manipulating data. 

| **Data Type**   | **Main Use**                            |
|-----------------|-----------------------------------------|
| String         | Simple Key-Value Store                 |
| List           | Queue and Stack Operations             |
| Set            | Store Unique Items                     |
| Sorted Set     | Ranking System or Leaderboards         |
| Hash           | Store Objects                          |
| Bitmaps        | Boolean Flags and Presence Tracking    |
| HyperLogLog    | Unique Count Estimation                |
| Streams        | Real-time Data Logs and Events         |


