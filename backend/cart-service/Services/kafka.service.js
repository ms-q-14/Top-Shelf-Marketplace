const { Kafka } = require("kafkajs");
const RedisService = require("./redis.service");
class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: "cart-service",
      brokers: [process.env.KAFKA_HOST],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: "cart-group" });
    this.init();
  }

  async init() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: "invalidCartProduct",
      fromBeginning: true,
    });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const { cart_id, product_id, product } = JSON.parse(
          message.value.toString()
        );
        console.log("Message received", JSON.parse(message.value.toString()));

        if (product_id) {
          const cart = await RedisService.get(cart_id);
          const cartProducts = JSON.parse(cart);
          const newCartProducts = cartProducts.filter(
            (cartProduct) => cartProduct._id !== product_id
          );
          await RedisService.set({
            key: cart_id,
            value: JSON.stringify(newCartProducts),
          });
        } else if (product) {
          const cart = await RedisService.get(cart_id);
          const cartProducts = JSON.parse(cart);
          const newCartProducts = cartProducts.filter(
            (cartProduct) => cartProduct._id !== product._id
          );
          newCartProducts.push(product);
          await RedisService.set({
            key: cart_id,
            value: JSON.stringify(newCartProducts),
          });
        }
      },
    });
  }

  async sendMessage(message) {
    await this.producer.send({
      topic: "addToCart",
      messages: [{ value: JSON.stringify(message) }],
    });

    console.log("Message sent successfully");
  }
}
module.exports = new KafkaService();
