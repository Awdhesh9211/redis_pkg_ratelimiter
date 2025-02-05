const {RateLimiterRedis} =require("rate-limiter-flexible");
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

// Importing the RateLimiterRedis class from the appropriate package
module.exports.rateLimiter = new RateLimiterRedis({
  // The Redis client used to store the rate limit data (usually an instance of the Redis client)
  storeClient: redisClient,  // 'redisClient' should be your configured Redis client.

  // Prefix for the keys stored in Redis, helps to distinguish between different types of rate limiting
  keyPrefix: 'middleware',  // 'middleware' is the prefix for the keys created in Redis for rate limiting.

  // Points: The maximum number of requests allowed within the 'duration' window.
  points: 10, // Client can make a maximum of 10 requests in a given 'duration' period (in seconds).

  // Duration: The time window in seconds during which the rate limiting applies (this is the period of time the points are refreshed).
  duration: 60,  // This is a sliding window of 60 seconds, where the client can make up to 10 requests.

  // Block Duration: The amount of time in seconds the client will be blocked once they exceed the allowed requests.
  blockDuration: 120, // If the client exceeds 10 requests in 60 seconds, they will be blocked for 120 seconds.
});

