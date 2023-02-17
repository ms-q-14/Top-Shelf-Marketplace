const router = require("express").Router();
const Product = require("../db/Models/ProductSchema");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const AwsService = require("../Services/aws.service");
const crypto = require("crypto");
const KafkaService = require("../Services/kafka.service");
const ProductValidationService = require("../Services/validation.service");
const OrderService = require("../Services/order.service");
const stripe = require("stripe")(
  "sk_test_51MMimhIiPc5x4PoK2VFaV5H81GrVML8ACmAeX22zBDZ8Sju5EAjVFBP4pqYEfRZXITEgaOKBzyNepS09l7QnFkVT006THsqK10"
);

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
const isMyProduct = async (req, res, next) => {
  const token = req.cookies.accessToken;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: "Product not found" });
  if (product.userId !== req.user._id) {
    return res
      .status(403)
      .json({ error: "Unauthorized request not Users product" });
  }
  req.product = product;
  next();
};

router.post("/", validateToken, async (req, res) => {
  let sampleFile;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }
  sampleFile = req.files.image;

  //   const blob = fs.readFileSync(imagePath);
  const uuid = crypto.randomUUID();
  const fileType = sampleFile.mimetype.split("/")[1];
  const fileName = `${uuid}.${fileType}`;
  AwsService.uploadImage(fileName, sampleFile.data)
    .then((data) => {
      const product = new Product({
        title: req.body.title,
        description: req.body.description,
        image: data.Location,
        price: req.body.price,
        category: req.body.category,
        userId: req.user._id,
      });

      product.save((err, product) => {
        if (err && err.code === 11000) {
          return res.status(400).json({ error: "Product already exists" });
        } else if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Error saving product to database" });
        } else {
          return res
            .status(201)
            .json({ message: "Product created", product: product.id });
        }
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
});

router.patch("/:id", validateToken, isMyProduct, async (req, res) => {
  try {
    const product = req.product;
    if (req.body.title) product.title = req.body.title;
    if (req.body.description) product.description = req.body.description;
    if (req.body.price) product.price = req.body.price;
    if (req.body.category) product.category = req.body.category;
    if (req.body.sold) product.sold = req.body.sold;
    if (req.files && Object.keys(req.files).length > 0) {
      let sampleFile = req.files.image;
      const uuid = crypto.randomUUID();
      const fileType = sampleFile.mimetype.split("/")[1];
      const fileName = `${uuid}.${fileType}`;
      const uploadData = await AwsService.uploadImage(
        fileName,
        sampleFile.data
      );
      const imageUrl = uploadData.Location;
      await AwsService.deleteImage(product.image);
      product.image = imageUrl;
    }
    product.save((err, product) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res
        .status(200)
        .json({ message: "Product updated", product: product });
    });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get("/", async (req, res) => {
  try {
    switch (true) {
      case req.query.page != undefined && req.query.limit != undefined:
        let page = parseInt(req.query.page);
        let limit = parseInt(req.query.limit);

        let filterAction = { sold: { $eq: false } };
        if (req.query.category != undefined && req.query.category != "all") {
          filterAction = {
            category: req.query.category,
            sold: { $eq: false },
          };
        }

        let aggregateId = req.query.category != undefined ? "$category" : null;
        if (req.query.category === "all") aggregateId = null;
        //aggregate products with aggregateId and also where sold is equal to false

        Product.aggregate(
          [
            { $match: { sold: { $eq: false } } },
            { $group: { _id: aggregateId, count: { $sum: 1 } } },
          ],
          (err, result) => {
            if (err) return res.status(500).json({ error: err });
            //get object from result where _id is equal to category

            let categoryCount = result.find(
              (obj) =>
                obj._id ===
                (req.query.category === "all" ? null : req.query.category)
            );
            //if categoryCount is undefined set it to 0
            categoryCount = categoryCount ? categoryCount.count : 0;
            const lastPage = Math.ceil(categoryCount / limit);
            if (page > lastPage)
              return res.status(404).json({ error: "Page not found" });
            Product.find(filterAction)
              .sort({ createdAt: -1 })
              .limit(limit)
              .skip((page - 1) * limit)
              .exec((err, products) => {
                if (err) return res.status(500).json({ error: err });
                if (products.length > 0) {
                  return res.status(200).json({
                    products: products,
                    totalCount: categoryCount,
                    lastPage: lastPage,
                  });
                } else {
                  return res.status(404).json({ error: "No products found" });
                }
              });
          }
        );
        break;
      case req.query.page != undefined && req.query.limit == undefined:
        return res.status(400).json({ error: "Limit is required" });
        break;
      case req.query.page == undefined && req.query.limit != undefined:
        let limit2 = parseInt(req.query.limit);
        let filterAction2 = { sold: { $eq: false } };
        if (req.query.category != undefined && req.query.category != "all") {
          filterAction2 = {
            category: req.query.category,
            sold: { $eq: false },
          };
        }
        Product.find(filterAction2)
          .sort({ createdAt: -1 })
          .limit(limit2)
          .exec((err, products) => {
            if (err) return res.status(500).json({ error: err });
            if (products.length > 0) {
              return res.status(200).json({ products: products });
            } else {
              return res.status(404).json({ error: "No products found" });
            }
          });
        break;
      default:
        let filterAction3 = { sold: { $eq: false } };
        if (req.query.category != undefined && req.query.category != "all") {
          filterAction3 = {
            category: req.query.category,
            sold: { $eq: false },
          };
        }
        Product.find(filterAction3)
          .sort({ createdAt: -1 })
          .exec((err, products) => {
            if (err) return res.status(500).json({ error: err });
            if (products.length > 0) {
              return res.status(200).json({ products: products });
            } else {
              return res.status(404).json({ error: "No products found" });
            }
          });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/user/:id", validateToken, async (req, res) => {
  try {
    if (req.user._id != req.params.id)
      return res.status(401).json({ error: "Unauthorized request" });
    Product.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .exec((err, products) => {
        if (err) return res.status(500).json({ error: err });
        if (products.length > 0) {
          return res.status(200).json({ products: products });
        } else {
          return res.status(404).json({ error: "No products found" });
        }
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.status(200).json({ product: product });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/checkout", validateToken, async (req, res) => {
  try {
    const { cart, token } = req.body;
    const invalidProducts = await KafkaService.validateCartProducts(
      req.user._id,
      cart
    );
    if (invalidProducts.length > 0) {
      return res.status(400).json({
        error: "Invalid products",
        invalidProducts: invalidProducts,
      });
    }
    const totalPrice = OrderService.cartTotalCalc(cart);
    console.log("____________");
    console.log(totalPrice);
    // create a new charge using the total price
    const charge = await stripe.charges.create({
      amount: totalPrice * 100,
      currency: "usd",
      source: token.id,
      description: "My Cart",
    });
    await OrderService.setProductsSold(cart);
    return res
      .status(200)
      .json({ message: "Checkout successful", ...req.body });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
