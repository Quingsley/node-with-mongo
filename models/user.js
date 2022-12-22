const getDb = require("../utils/database").getDb;
const mongodb = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: [{...products, quantity: value}]}
    this._id = new mongodb.ObjectId(id);
  }
  async save() {
    try {
      const db = getDb();
      const result = db.collection("users").insertOne(this);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async addToCart(product) {
    try {
      const currentProductIndex = this.cart.items.findIndex(
        (cartProduct) =>
          cartProduct.productId.toString() === product._id.toString()
      );
      const updatedCartItems = [...this.cart.items];
      let newQuantity = 1;
      if (currentProductIndex >= 0) {
        //increase quantity
        newQuantity = this.cart.items[currentProductIndex].quanitity + 1;
        updatedCartItems[currentProductIndex].quanitity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: new mongodb.ObjectId(product._id),
          quanitity: newQuantity,
        });
      }
      const db = getDb();
      const updatedCart = {
        items: updatedCartItems,
      };
      const result = await db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: updatedCart } }
        );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getCart() {
    try {
      const productIds = this.cart.items.map((item) => item.productId);
      const data = await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .toArray();

      return data.map((product) => {
        return {
          ...product,
          quanitity: this.cart.items.find(
            (cartProduct) =>
              cartProduct.productId.toString() === product._id.toString()
          ).quanitity,
        };
      });
    } catch (error) {
      throw error;
    }
  }
  static async findById(userId) {
    try {
      const db = getDb();
      return db
        .collection("users")
        .findOne({ _id: new mongodb.ObjectId(userId) });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
