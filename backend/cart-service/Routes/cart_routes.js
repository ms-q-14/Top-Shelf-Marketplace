const router = require("express").Router();
const KafkaService = require("../Services/kafka.service");
const RedisService = require("../Services/redis.service");
const jwt = require("jsonwebtoken");
const request = require("request");
//const fetch = require("node-fetch");
const axios = require("axios");
const product_service = process.env.PRODUCT_SERVICE || "localhost";
//Middleware
const validateToken = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Error verifying token" });
    } else {
      req.user = decoded.user;
      next();
    }
  });
};

const validateProduct = (req, res, next) => {
  if (!(req.body._id && req.body.title && req.body.price && req.body.image)) {
    return res
      .status(400)
      .json({ error: "Request body is missing required fields" });
  }
  next();
};

router.get("/", validateToken, async (req, res) => {
  const cart = await RedisService.get(req.user._id);
  if (cart) {
    return res.json({ cart: JSON.parse(cart) });
  } else {
    return res.json({ cart: [] });
  }
  // KafkaService.sendMessage({ message: "Hello World!" });
});

router.post("/add", validateToken, validateProduct, async (req, res) => {
  try {
    const cart = await RedisService.get(req.user._id);
    await KafkaService.sendMessage({ ...req.body, cart_id: req.user._id });
    if (cart) {
      const parsedCart = JSON.parse(cart);
      const item = parsedCart.find((item) => item._id === req.body._id);
      if (!item) {
        parsedCart.push({ ...req.body });
      }
      // console.log(parsedCart);
      await RedisService.set({
        key: req.user._id,
        value: JSON.stringify(parsedCart),
      });
      return res.json({ cart: parsedCart });
    } else {
      await RedisService.set({
        key: req.user._id,
        value: JSON.stringify([{ ...req.body }]),
      });
      return res.json({ cart: [{ ...req.body }] });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error adding item to cart" });
  }
});

router.post("/remove", validateToken, async (req, res) => {
  try {
    const cart = await RedisService.get(req.user._id);
    if (cart) {
      const parsedCart = JSON.parse(cart);
      const item = parsedCart.find((item) => item._id === req.body._id);
      if (item) {
        const index = parsedCart.indexOf(item);
        parsedCart.splice(index, 1);
      }
      await RedisService.set({
        key: req.user._id,
        value: JSON.stringify(parsedCart),
      });
      return res.json({ cart: parsedCart });
    } else {
      return res.json({ cart: [] });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error removing item from cart" });
  }
});

router.delete("/", validateToken, async (req, res) => {
  try {
    await RedisService.del(req.user._id);
    return res.json({ cart: [] });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error deleting cart" });
  }
});

router.post("/checkout", validateToken, async (req, res) => {
  try {
    //get cart
    const cart = await RedisService.get(req.user._id);
    if (!cart) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    const cookies = req.cookies;
    const response = await axios.post(
      `http://${product_service}:3001/api/product/checkout`,
      {
        cart: JSON.parse(cart),
        token: req.body.token,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `accessToken=${cookies.accessToken}; refreshToken=${cookies.refreshToken}`,
        },
      }
    );
    const data = response.data;
    if (data.error) {
      return res.status(400).json({ error: data.error });
    }
    //if payment successful remove cart
    await RedisService.del(req.user._id);
    return res.json({ message: "Checkout successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error checking out" });
  }
});

module.exports = router;
