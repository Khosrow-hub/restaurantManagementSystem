const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDatabase = async () => {
  const localUri = process.env.DB_LOCAL_URI;

  try {
    const con = await mongoose.connect(localUri, {});
    console.log(`MongoDB Database connected with HOST:${con.connection.host}`);
    return;
  } catch (error) {
    console.warn(
      "Local MongoDB connection failed. Starting in-memory MongoDB fallback..."
    );
  }

  memoryServer = await MongoMemoryServer.create({
    binary: {
      version: "4.4.28",
    },
  });
  const memoryUri = memoryServer.getUri();
  const con = await mongoose.connect(memoryUri, {});
  console.log(
    `In-memory MongoDB connected with HOST:${con.connection.host} (dev fallback)`
  );
};

module.exports = connectDatabase;
