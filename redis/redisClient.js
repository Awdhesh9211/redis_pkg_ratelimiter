// Import ioredis package
const Redis = require('ioredis');

// Connect to the Redis container
const redisClient = new Redis({
  host: 'localhost',    // The Redis server host (localhost in your case)
  port: 6379,           // The Redis server port
});

// Test the connection by pinging the server
redisClient.ping()
  .then(result => {
    console.log('Redis connection successful:', result);
  })
  .catch(err => {
    console.error('Error connecting to Redis:', err);
  });

module.exports.redisClient;
