//start the server

//load env variables
//start server

//import dotenv
const dotenv = require("dotenv");

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.stack}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

//Load config
dotenv.config({ path: "./config/config.env" })

//Import app
const app = require("./app");
const connectDatabase = require("./db");

//connect to database
if (process.env.DEMO_MODE !== "true") {
  connectDatabase();
} else {
  console.log("Running in DEMO_MODE (no MongoDB required)");
}

//start the server

const server = app.listen(process.env.PORT,() =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to Unhandled Promise rejection");
  server.close(() => process.exit(1));
});