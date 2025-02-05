const express=require("express");
const  {rateLimiterMiddleware}  = require("./middleware/rateLimiterMiddleware");
const app=express();
const PORT=5555;
app.use(rateLimiterMiddleware);// rate limiter
app.get("/",(req,res)=>{
    res.send("Hello World!");
})

app.listen(PORT);