const { Kafka, TooManyRequestsError } = require("kafkajs");
const ValidationService = require("./validation.service");
const ProductNotFound = require("./Errors/ProductNotFound");
const ProductInvalid = require("./Errors/ProductInvalid");
const ProductSold = require("./Errors/ProductSold");

class KafkaService {
  static instance = null;
  constructor() {
    if (KafkaService.instance) {
      return KafkaService.instance;
    } else {
      this.kafka = new Kafka({
        clientId: "product-service",
        brokers: [process.env.KAFKA_HOST],
      });
      this.producer = this.kafka.producer();
      this.consumer = this.kafka.consumer({ groupId: "product-group" });
      this.init();
      KafkaService.instance = this;
    }
  }

  async init() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: "addToCart", fromBeginning: true });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          switch (topic) {
            case "addToCart":
              const { title, price, image, _id, cart_id } = JSON.parse(
                message.value.toString()
              );
              console.log(
                "Message received",
                JSON.parse(message.value.toString())
              );
              await ValidationService.validateProduct({
                title,
                price,
                image,
                _id,
                cart_id,
              });
              break;
          }
        } catch (err) {
          switch (err.constructor) {
            case ProductNotFound:
              this.sendMessage({
                cart_id: err.cart_id,
                product_id: err.product_id,
              });
              break;
            case ProductInvalid:
              this.sendMessage({ cart_id: err.cart_id, product: err.product });
              break;
            case ProductSold:
              this.sendMessage({
                cart_id: err.cart_id,
                product_id: err.product_id,
              });
              break;
            case TooManyRequestsError:
              consumer.pause([{ topic }]);
              setTimeout(
                () => consumer.resume([{ topic }]),
                e.retryAfter * 1000
              );
              break;
            default:
              console.log(err);
              break;
          }
        }
      },
    });
  }

  async validateCartProducts(cart_id, products) {
    const invalidProducts = [];
    for (const product of products) {
      try {
        const { title, price, image, _id } = product;
        product.cart_id = cart_id;
        await ValidationService.validateProduct(product);
      } catch (err) {
        switch (err.constructor) {
          case ProductNotFound:
            invalidProducts.push(err.product_id);
            this.sendMessage({
              cart_id: err.cart_id,
              product_id: err.product_id,
            });
            break;
          case ProductInvalid:
            invalidProducts.push(err.product);
            this.sendMessage({ cart_id: err.cart_id, product: err.product });
            break;
          case ProductSold:
            invalidProducts.push(err.product_id);
            this.sendMessage({
              cart_id: err.cart_id,
              product_id: err.product_id,
            });
            break;
        }
      }
      return invalidProducts;
    }
  }

  async sendMessage(message) {
    await this.producer.send({
      topic: "invalidCartProduct",
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log("Message sent successfully");
  }
}

module.exports = new KafkaService();
