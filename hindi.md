नीचे पूरा **README.md** फॉर्मेट में Redis का बेसिक से एडवांस तक की जानकारी, रियल-लाइफ कोड उदाहरणों के साथ दी गई है।  

---

### 📌 **README.md - Redis Basic to Advanced with Real-life Examples**  

```md
# 🚀 Redis: Basic to Advanced with Real-life Examples  

Redis (Remote Dictionary Server) एक इन-मेरी कैशिंग सिस्टम और डेटाबेस है, जिसका उपयोग तेजी से डेटा एक्सेस, सेशन मैनेजमेंट, क्यू सिस्टम और कैशिंग के लिए किया जाता है।  

---

## 🔥 Redis को क्यों इस्तेमाल करें?  

- 🔹 Fast Performance - In-memory database होने के कारण बहुत तेज़ होता है।  
- 🔹 Supports Multiple Data Types - Strings, Lists, Sets, Hashes, Sorted Sets आदि को सपोर्ट करता है।  
- 🔹 Persistence - डिस्क पर डेटा को सेव करके भविष्य में उपयोग कर सकते हैं।  
- 🔹 Pub/Sub Messaging - रियल-टाइम कम्युनिकेशन के लिए इस्तेमाल होता है।  

---

## 🚀 Redis Installation (Linux & Windows)  

### **Linux (Ubuntu/Debian)**  
```bash
sudo apt update  
sudo apt install redis-server  
sudo systemctl start redis  
sudo systemctl enable redis  
```
### **Windows**  
Windows पर Redis को इंस्टॉल करने के लिए WSL या Docker का उपयोग करें।  

---

## 🎯 Redis Basics Commands  

| Command | काम करता है | Example |
|---------|------------|---------|
| `SET key value` | एक वैल्यू सेट करता है | `SET name "Awdhesh"` |
| `GET key` | एक वैल्यू प्राप्त करता है | `GET name` |
| `DEL key` | एक की को डिलीट करता है | `DEL name` |
| `EXPIRE key seconds` | किसी की को टाइम लिमिट देता है | `EXPIRE name 10` |
| `TTL key` | टाइम रिमेनिंग देखता है | `TTL name` |

---

## 🛠 Real-life Use Cases with Code  

### 1️⃣ **Session Management (यूजर लॉगिन सिस्टम)**  
```js
const redis = require("redis");
const client = redis.createClient();

client.setex("user:1234", 3600, JSON.stringify({ username: "awdhesh", role: "admin" }));

client.get("user:1234", (err, data) => {
    console.log(JSON.parse(data)); // { username: "awdhesh", role: "admin" }
});
```
👉 जब यूजर लॉगिन करेगा, तो उसकी जानकारी Redis में 1 घंटे के लिए स्टोर होगी।  

---

### 2️⃣ **Rate Limiting (API Request को कंट्रोल करना)**  
```js
const limit = 5; // एक यूजर 5 बार API कॉल कर सकता है
client.incr("user:api:1234", (err, count) => {
    if (count === 1) client.expire("user:api:1234", 60); // 1 मिनट बाद काउंट रीसेट होगा
    if (count > limit) return console.log("Too many requests!");
    console.log("API Request Success");
});
```
👉 इससे किसी यूजर को बहुत ज्यादा API कॉल करने से रोका जा सकता है।  

---

### 3️⃣ **Real-time Chat using Pub/Sub**  
```js
// Publisher
client.publish("chatroom", "Hello, How are you?");

// Subscriber
client.subscribe("chatroom");
client.on("message", (channel, message) => {
    console.log(`Message received in ${channel}: ${message}`);
});
```
👉 यह चैटिंग या नोटिफिकेशन सिस्टम में उपयोग होता है।  

---

### 4️⃣ **Caching with Redis**  
```js
const fetch = require("node-fetch");

const getUserData = async (userId) => {
    client.get(`user:${userId}`, async (err, data) => {
        if (data) {
            console.log("Cache Hit:", JSON.parse(data));
        } else {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
            const user = await response.json();
            client.setex(`user:${userId}`, 600, JSON.stringify(user));
            console.log("Cache Miss:", user);
        }
    });
};

getUserData(1);
```
👉 इससे API कॉल्स को कम किया जा सकता है और डेटा को तेज़ी से एक्सेस किया जा सकता है।  

---

### 5️⃣ **Task Queue System**  
```js
client.rpush("tasks", "Task1", "Task2");
client.lpop("tasks", (err, task) => {
    console.log("Processing:", task);
});
```
👉 यह बैकग्राउंड टास्क प्रोसेसिंग के लिए उपयोगी है।  

---

## ⚡ Advanced Redis Features  

### 🔹 **Redis Hashes (Key-Value Store)**
```js
client.hset("user:1001", "name", "Awdhesh", "age", "22");
client.hgetall("user:1001", (err, data) => {
    console.log(data); // { name: 'Awdhesh', age: '22' }
});
```

### 🔹 **Redis Lists (FIFO & LIFO)**
```js
client.lpush("tasks", "Task1", "Task2"); // Add at start
client.rpush("tasks", "Task3"); // Add at end
client.lrange("tasks", 0, -1, (err, data) => {
    console.log(data); // ['Task2', 'Task1', 'Task3']
});
```

### 🔹 **Redis Sorted Sets (Leaderboard System)**
```js
client.zadd("leaderboard", 100, "Alice", 200, "Bob");
client.zrevrange("leaderboard", 0, -1, "WITHSCORES", (err, data) => {
    console.log(data); // ['Bob', '200', 'Alice', '100']
});
```
---

## 🎯 Conclusion (Redis क्यों चुनें?)  
✅ **तेज़** - माइक्रोसेकंड में डेटा एक्सेस  
✅ **स्केलेबल** - बड़ी एप्लिकेशन के लिए परफेक्ट  
✅ **मल्टीपरपज** - कैशिंग, रियल-टाइम चैट, सेशन मैनेजमेंट  

---

# 📌 **Redis के सभी डेटा टाइप और उनके CRUD ऑपरेशन (Node.js Code के साथ)**  

Redis एक **In-Memory Data Store** है, जिसे हाई-स्पीड डेटा एक्सेस के लिए उपयोग किया जाता है। यह कई प्रकार के डेटा टाइप्स को स्टोर कर सकता है। यहां **सभी डेटा टाइप्स के CRUD (Create, Read, Update, Delete) ऑपरेशन** को **Node.js कोड के साथ** समझाया गया है।  

---

## 🔹 **पहले Redis को Node.js में सेट करें**  
### 1️⃣ **Redis और Node.js सेटअप करें**  
सबसे पहले **Redis और Node.js** इंस्टॉल करें। फिर, `redis` पैकेज को इंस्टॉल करें:  
```sh
npm install redis
```

### 2️⃣ **Redis क्लाइंट कनेक्ट करें**  
```js
const redis = require("redis");
const client = redis.createClient();

client.on("connect", () => console.log("✅ Connected to Redis!"));
client.on("error", (err) => console.log("❌ Redis Error: ", err));

client.connect(); // Redis v4 के लिए
```

---

# 📌 **1. String (स्ट्रिंग)**
## ✅ **CRUD ऑपरेशन**
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

# 📌 **2. List (लिस्ट)**
## ✅ **CRUD ऑपरेशन**
```js
// CREATE (LPUSH - Start में जोड़ना, RPUSH - End में जोड़ना)
await client.lPush("tasks", "Task1", "Task2", "Task3");

// READ (List को देखना)
const tasks = await client.lRange("tasks", 0, -1);
console.log("Tasks:", tasks); // Output: ["Task3", "Task2", "Task1"]

// UPDATE (Index से Update करना)
await client.lSet("tasks", 1, "Updated Task2");

// DELETE (LPOP - Start से हटाना, RPOP - End से हटाना)
await client.lPop("tasks");
console.log("Deleted first task!");
```

---

# 📌 **3. Set (सेट - Unique Values)**
## ✅ **CRUD ऑपरेशन**
```js
// CREATE
await client.sAdd("colors", "Red", "Blue", "Green");

// READ
const colors = await client.sMembers("colors");
console.log("Colors:", colors); // Output: ["Red", "Blue", "Green"]

// UPDATE (पहले डिलीट करो फिर ऐड करो)
await client.sRem("colors", "Blue");
await client.sAdd("colors", "Yellow");

// DELETE (सभी वैल्यू हटाएं)
await client.del("colors");
console.log("Deleted all colors!");
```

---

# 📌 **4. Sorted Set (सॉर्टेड सेट)**
## ✅ **CRUD ऑपरेशन**
```js
// CREATE (ZADD - स्कोर के साथ जोड़ना)
await client.zAdd("scores", [
  { score: 100, value: "Player1" },
  { score: 200, value: "Player2" }
]);

// READ (स्कोर के अनुसार निकालना)
const scores = await client.zRangeWithScores("scores", 0, -1);
console.log("Scores:", scores);

// UPDATE (स्कोर अपडेट करना)
await client.zIncrBy("scores", 50, "Player1");

// DELETE (एक प्लेयर को हटाना)
await client.zRem("scores", "Player2");

// DELETE (पूरा डेटा हटाना)
await client.del("scores");
```

---

# 📌 **5. Hash (हैश - Key-Value Pairs)**
## ✅ **CRUD ऑपरेशन**
```js
// CREATE
await client.hSet("user:1", { name: "Awdhesh", age: 22 });

// READ
const user = await client.hGetAll("user:1");
console.log("User:", user); // Output: { name: "Awdhesh", age: "22" }

// UPDATE
await client.hSet("user:1", "age", 23);

// DELETE (एक फील्ड हटाना)
await client.hDel("user:1", "age");

// DELETE (पूरा डेटा हटाना)
await client.del("user:1");
```

---

# 📌 **6. Bitmaps (बिटमैप्स - Binary Data)**
## ✅ **CRUD ऑपरेशन**
```js
// CREATE & UPDATE (बिट सेट करना)
await client.setBit("attendance", 1, 1);

// READ (बिट चेक करना)
const bit = await client.getBit("attendance", 1);
console.log("Attendance:", bit); // Output: 1

// DELETE (पूरी की हटाना)
await client.del("attendance");
```

---

# 📌 **7. HyperLogLog (हाइपरलॉगलॉग - Approximate Counting)**
## ✅ **CRUD ऑपरेशन**
```js
// CREATE
await client.pfAdd("unique_users", "User1", "User2", "User3");

// READ (काउंट निकालना)
const count = await client.pfCount("unique_users");
console.log("Unique Users:", count); 

// DELETE (पूरा डेटा हटाना)
await client.del("unique_users");
```

---

# 📌 **8. Streams (स्ट्रीम्स - Real-time Data)**
## ✅ **CRUD ऑपरेशन**
```js
// CREATE (XADD - स्ट्रीम में नया डेटा जोड़ना)
await client.xAdd("mystream", "*", { user: "Awdhesh", message: "Hello Redis!" });

// READ (XRANGE - डेटा पढ़ना)
const messages = await client.xRange("mystream", "-", "+");
console.log("Messages:", messages);

// DELETE (स्ट्रीम को हटाना)
await client.del("mystream");
```

---

# 🎯 **निष्कर्ष (Conclusion)**
Redis एक **तेज़ और शक्तिशाली NoSQL डेटा स्टोर** है जो विभिन्न प्रकार के डेटा को स्टोर कर सकता है।  

| **डेटा टाइप**   | **मुख्य उपयोग**                            |
|----------------|--------------------------------|
| String        | Simple Key-Value Store        |
| List         | Queue और Stack Operations     |
| Set          | Unique Items Store करना       |
| Sorted Set   | Ranking System या Leaderboards |
| Hash         | Objects को स्टोर करना          |
| Bitmaps      | Boolean Flags और Presence Track करना |
| HyperLogLog  | Unique Count Estimation       |
| Streams      | Real-time Data Logs और Events |

