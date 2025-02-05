const   {rateLimiter}  = require("../utils/rateLimiter")

module.exports.rateLimiterMiddleware=(req,res,next)=>{
  // Normalize the IP address to handle both IPv4 and IPv6 properly
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // If the IP is in IPv6 format (e.g., "::ffff:127.0.0.1"), convert it to IPv4
  const normalizedIp = ip.startsWith('::ffff:') ? ip.slice(7) : ip;

  console.log('Normalized IP:', normalizedIp); // For debugging


  rateLimiter.consume(normalizedIp)
    .then(() => next())
    .catch((rej) => {
      const retrySec = Math.round(rej.msBeforeNext / 1000) || 1;
      res.set('Retry-After', String(retrySec));
      res.status(429).send(`Too many requests... Wait for ${retrySec} sec`);
    });           
}
