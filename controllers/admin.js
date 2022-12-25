const Product = require("../models/product");
const mongodb = require("mongodb");
// const Cart = require("../models/cart");

exports.getAddProduct = (request, response, next) => {
  response.render("admin/edit-product", {
    docTitle: "Add-Product",
    path: "/add-product",
    editing: false,
  });
};

exports.postAddProduct = async (request, response, next) => {
  const title = request.body.title;
  const description = request.body.description;
  const imageUrl = request.body.imageUrl;
  const price = request.body.price;
  const product = new Product(
    title,
    description,
    imageUrl,
    price,
    null,
    request.user._id
  );

  try {
    await product.save();

    response.redirect("/admin/products");
  } catch (error) {
    console.log(error);
  }
};
exports.getProducts = async (request, response, next) => {
  try {
    const products = await Product.fetchAll();
    response.render("admin/products", {
      prods: products,
      docTitle: "Products",
      path: "/admin/products",
    });
  } catch (error) {
    console.log(error);
  }
};

exports.getEditProduct = async (request, response, next) => {
  let editMode = request.query.edit;
  const prodId = request.params.productId;
  if (!editMode) {
    return response.redirect("/");
  }

  editMode = editMode === "true";
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      response.redirect("/");
    }
    response.render("admin/edit-product", {
      docTitle: "Edit Product 📝",
      path: "/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postEditProduct = async (request, response, next) => {
  const prodId = request.body.productId.trim();
  const updatedTitle = request.body.title.trim();
  const updatedImageUrl = request.body.imageUrl.trim();
  const updatedPrice = request.body.price.trim();
  const updatedDesc = request.body.description.trim();
  try {
    const product = new Product(
      updatedTitle,
      updatedDesc,
      updatedImageUrl,
      updatedPrice,
      prodId
    );

    const res = await product.save();

    if (res) {
      response.redirect("/admin/products");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postDeleteProduct = async (request, response, next) => {
  const prodId = request.body.productId;
  const userId = request.user._id;
  try {
    const result = await Product.deleteById(prodId, userId);

    if (result) {
      response.redirect("/admin/products");
    }
  } catch (error) {
    console.log(error);
  }
};
