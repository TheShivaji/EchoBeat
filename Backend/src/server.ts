import app from "./index.js"
import config from "./config/config.js"

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
});
