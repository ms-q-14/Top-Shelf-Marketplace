class ProductInvalid extends Error {
  constructor(message, product, cart_id) {
    super(message);
    this.name = "ProductInvalid";
    this.product = product;
    this.cart_id = cart_id;
  }
}
module.exports = ProductInvalid;
