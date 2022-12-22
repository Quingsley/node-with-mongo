const mongodb = require("mongodb");
const PASSWORD = require("./password");

const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnection = async (callBack) => {
  try {
    const client = await MongoClient.connect(
      `mongodb+srv://quingsley:${PASSWORD}@cluster0.hkxyhxj.mongodb.net/shop?retryWrites=true`
    );
    if (client) {
      console.log("Connected Successfully");
    }
    _db = client.db();
    callBack();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "Database Not Found";
};
exports.mongoConnection = mongoConnection;
exports.getDb = getDb;
