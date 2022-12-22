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

// exports.getCart = async (request, response, next) => {
//   try {
//     const cart = await request.user.getCart();
//     const products = await cart.getProducts();
//     response.render("shop/cart", {
//       docTitle: "Your Cart 🛒",
//       path: "/cart",
//       cart: products,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
exports.postCart = async (request, response, next) => {
  const productId = request.body.productId;
  try {
    const currentProduct = await Product.findById(productId);
    const user = request.user; //USER INSTANCE HAVING METHODS
    const addingToCart = await user.addToCart(currentProduct);
    console.log(addingToCart);
    // const products = await fetchedCart.getProducts({
    //   where: { id: productId },
    // });

    // let product;
    // if (products.length > 0) {
    //   product = products[0];
    // }

    // let newQuantity = 1;
    // if (product) {
    //   const oldQuantity = product.cartItem.quantity;
    //   newQuantity = oldQuantity + 1;
    //   const addingToCart = await fetchedCart.addProduct(product, {
    //     through: { quantity: newQuantity },
    //   });
    //   if (addingToCart) {
    //     response.redirect("/cart");
    //   }
    // }
    // const currentProduct = await Product.findByPk(productId);

    // const addingToCart = await fetchedCart.addProduct(currentProduct, {
    //   through: { quantity: newQuantity },
    // });
    if (addingToCart) {
      response.redirect("/cart");
    }
  } catch (error) {
    console.error(error);
  }
};

// exports.deleteCartProduct = async (request, response, next) => {
//   const productId = request.body.productId;
//   try {
//     const cart = await request.user.getCart();
//     const products = await cart.getProducts({ where: { id: productId } });
//     const currentProduct = products[0];
//     const result = await currentProduct.cartItem.destroy();
//     if (result) {
//       response.redirect("/cart");
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

// exports.getOrders = async (request, response, next) => {
//   try {
//     const orders = await request.user.getOrders({ include: ["products"] });

//     response.render("shop/orders", {
//       docTitle: "Your Orders",
//       path: "/orders",
//       orders: orders,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.postOrders = async (request, response, next) => {
//   try {
//     const cart = await request.user.getCart();
//     const products = await cart.getProducts();
//     const order = await request.user.createOrder();
//     const addCartProductsToOrders = await order.addProducts(
//       products.map((product) => {
//         product.orderItem = { quantity: product.cartItem.quantity };
//         return product;
//       })
//     );
//     if (addCartProductsToOrders) {
//       const resetCart = await cart.setProducts(null);
//       if (resetCart) {
//         response.render("shop/orders", {
//           docTitle: "Your Orders",
//           path: "/orders",
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
