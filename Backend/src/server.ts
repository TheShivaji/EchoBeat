import app from "./index.js"
import config from "./config/config.js"
import { connectRedis } from "./config/redis.js"

connectRedis().then(() => {
    console.log("Redis connected");
}).catch((err) => {
    console.error("Redis connection error", err);
});
app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
