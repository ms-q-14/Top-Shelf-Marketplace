const Product = require("../db/Models/ProductSchema");
const ProductNotFound = require("../Services/Errors/ProductNotFound");
const ProductInvalid = require("../Services/Errors/ProductInvalid");
const mongoose = require("mongoose");
const ProductSold = require("./Errors/ProductSold");
const KafkaService = require("./kafka.service");
class ValidationService {
  constructor() {
    this.product = Product;
  }

  async validateProduct({ title, price, image, _id, cart_id }) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new ProductNotFound("Product not found", _id, cart_id);
    }
    const product = await this.product.findById(_id);
    if (product) {
      if (product.sold) {
        throw new ProductSold("Product is invalid", _id, cart_id);
      } else if (
        product.title != title ||
        product.image != image ||
        product.price != price
      ) {
        throw new ProductInvalid("Product is invalid", product, cart_id);
      }
    } else {
      throw new ProductNotFound("Product not found", _id, cart_id);
    }
  }
}

module.exports = new ValidationService();
