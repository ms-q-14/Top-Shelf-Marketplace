class ProductNotFound extends Error {
  constructor(message, product_id, cart_id) {
    super(message);
    this.name = "ProductNotFound";
    this.product_id = product_id;
    this.cart_id = cart_id;
  }
}
module.exports = ProductNotFound;
