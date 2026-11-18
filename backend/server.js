const app = require("./app");
const connectDB = require("./config/db");
const config = require("./config/env");

const startServer = async () => {
    try {
        await connectDB();

        app.listen(config.PORT, () => {
            console.log(
                `AquaGrow Server running on port ${config.PORT}`
            );
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();