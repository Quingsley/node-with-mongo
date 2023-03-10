const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;
class Product {
  constructor(title, description, imageUrl, price, id, userId) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = new mongodb.ObjectId(userId);
  }

  async save() {
    const db = getDb();
    let result;

    try {
      if (this._id) {
        //update
        result = await db
          .collection("products")
          .updateOne({ _id: this._id }, { $set: this });
      } else {
        result = await db.collection("products").insertOne(this);
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const data = await db.collection("products").find().toArray();
      return data;
    } catch (err) {
      throw err;
    }
  }

  static async findById(prodId) {
    try {
      const db = getDb();
      const result = await db
        .collection("products")
        .find({ _id: new mongodb.ObjectId(prodId) })
        .next();
      return result;
    } catch (error) {
      throw error;
    }
  }

  static async deleteById(prodId, userId) {
    try {
      const db = getDb();

      const result = await db
        .collection("products")
        .deleteOne({ _id: new mongodb.ObjectId(prodId) });
      if (result) {
        const deleteFromCart = await db.collection("users").updateOne(
          { _id: new mongodb.ObjectId(userId) },
          {
            $pull: {
              "cart.items": { productId: new mongodb.ObjectId(prodId) },
            },
          }
        );
        if (deleteFromCart) {
          return result;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Product;
