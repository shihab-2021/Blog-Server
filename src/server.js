import mongoose from "mongoose";
import config from "./app/config/index.js";
import app from "./app.js";

const server = async () => {
  try {
    await mongoose.connect(config.database_url);

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port} 🏃‍♂️`);
    });
  } catch (error) {
    console.error(error);
  }
};

server();
