const Product = require("../models/product");

exports.getProducts = async (request, response, next) => {
  try {
    const products = await Product.fetchAll();
    if (products) {
      response.render("shop/product-list", {
        prods: products,
        docTitle: "All Products",
        path: "/products",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getProductsDetail = async (request, response, next) => {
  const prodId = request.params.productId;
  try {
    const product = await Product.findById(prodId);
    response.render("shop/product-detail", {
      docTitle: product.title,
      path: "/products",
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getIndex = async (request, response, next) => {
  try {
    const products = await Product.fetchAll();
    if (products) {
      response.render("shop/index", {
        products: products,
        docTitle: "SHOP 🏪",
        path: "/",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getCart = async (request, response, next) => {
  try {
    const cart = await request.user.getCart();
    response.render("shop/cart", {
      docTitle: "Your Cart 🛒",
      path: "/cart",
      cart: cart,
    });
  } catch (error) {
    console.log(error);
  }
};
exports.postCart = async (request, response, next) => {
  const productId = request.body.productId;
  try {
    const currentProduct = await Product.findById(productId);
    const user = request.user; //USER INSTANCE HAVING METHODS
    const addingToCart = await user.addToCart(currentProduct);
    if (addingToCart) {
      response.redirect("/cart");
    }
  } catch (error) {
    console.error(error);
  }
};

exports.deleteCartProduct = async (request, response, next) => {
  const productId = request.body.productId;
  try {
    const result = await request.user.deleteProductFromCart(productId);
    if (result) {
      response.redirect("/cart");
    }
  } catch (error) {
    console.error(error);
  }
};

exports.getOrders = async (request, response, next) => {
  try {
    const orders = await request.user.getOrders();

    response.render("shop/orders", {
      docTitle: "Your Orders",
      path: "/orders",
      orders: orders,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postOrders = async (request, response, next) => {
  try {
    const user = request.user;
    const result = await user.addOrders();
    if (result) {
      response.redirect("/orders");
    }
  } catch (error) {
    console.log(error);
  }
};
