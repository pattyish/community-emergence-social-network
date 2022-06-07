const regenerator = require("regenerator-runtime/runtime");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { MongoMemoryServer } = require("mongodb-memory-server");
let mongoServer;
const data_db = require("./data");

dotenv.config();

const DBConnection = async () => {
  try {
    // let mongoUri = "";
    // Checking if the environment is testing
    if (process.env.NODE_ENV === "test") {
      // mongoServer = new MongoMemoryServer();
      // mongoUri = await mongoServer.getUri();
      let mongoUri = data_db.CONNECTION_STRING_TEST;
      console.log("MongoUri: ",mongoUri);
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      let mongoUri = data_db.CONNECTION_STRING;
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // await mongoose.connect(mongoUri, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

    console.log("Database connected successfull!!!!!!!!");
  } catch (error) {
    console.log(error.message);
  }
};

const close = async () => {
  await mongoose.disconnect();
  // if (process.env.NODE_ENV === "test") {
  //   await mongoServer.stop();
  // }
};

class DatabaseConnection {
  constructor(connection) {
    if (!this.instance) {
      this.instance = connection;
    }
  }
  getInstance() {
    return this.instance;
  }
}

const connection = new DatabaseConnection(DBConnection).getInstance();
module.exports = { connection, close };
