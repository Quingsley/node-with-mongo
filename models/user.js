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
        newQuantity = this.cart.items[currentProductIndex].quantity + 1;
        updatedCartItems[currentProductIndex].quantity = newQuantity;
      } else {
        updatedCartItems.push({
          productId: new mongodb.ObjectId(product._id),
          quantity: newQuantity,
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
      const db = getDb();
      const productIds = this.cart.items.map((item) => item.productId);
      const data = await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .toArray();

      return data.map((product) => {
        return {
          ...product,
          quantity: this.cart.items.find(
            (cartProduct) =>
              cartProduct.productId.toString() === product._id.toString()
          ).quantity,
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

  async deleteProductFromCart(prodId) {
    try {
      const updatedCart = this.cart.items.filter(
        (item) => item.productId.toString() !== prodId.toString()
      );
      const db = getDb();
      const result = await db
        .collection("users")
        .updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: updatedCart } } }
        );
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addOrders() {
    try {
      const db = getDb();

      const cartProducts = await this.getCart();
      const order = {
        items: cartProducts,
        user: {
          _id: new mongodb.ObjectId(this._id),
          name: this.username,
        },
      };

      const result = await db.collection("orders").insertOne(order);
      if (result) {
        this.cart = { items: [] }; //delete cart products from local array
        const result = await db // delete cart products from the DB
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  async getOrders() {
    try {
      const db = getDb();
      const orders = await db
        .collection("orders")
        .find({ "user._id": this._id })
        .toArray();
      return orders;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
