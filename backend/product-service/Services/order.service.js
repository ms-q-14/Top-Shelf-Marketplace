const Product = require("../db/Models/ProductSchema");
class OrderService {
  static instance = null;
  constructor() {
    if (OrderService.instance === null) {
      OrderService.instance = this;
    } else {
      return OrderService.instance;
    }
  }
  cartTotalCalc(cart) {
    let totalPrice = 0;
    for (const product of cart) {
      totalPrice = totalPrice + product.price;
    }
    return totalPrice;
  }
  async setProductsSold(cart) {
    for (const product of cart) {
      const dbProduct = await Product.findById(product._id);
      if (dbProduct) {
        dbProduct.sold = true;
        await dbProduct.save();
      }
    }
  }
}

module.exports = new OrderService();
