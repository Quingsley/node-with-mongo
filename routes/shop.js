const express = require("express");
const path = require("path");

const shopProductsController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopProductsController.getIndex);
router.get(
  "/product-detail/:productId",
  shopProductsController.getProductsDetail
);
router.get("/cart", shopProductsController.getCart);
router.post("/cart", shopProductsController.postCart);
router.get("/orders", shopProductsController.getOrders);
router.post("/orders", shopProductsController.postOrders);
router.get("/products", shopProductsController.getProducts);
router.post("/cart-delete", shopProductsController.deleteCartProduct);

module.exports = router;
