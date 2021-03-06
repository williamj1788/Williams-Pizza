const { verifyAdmin } = require("../middleware/verifyAdmin");

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

const { verifyToken } = require("../middleware/verifyToken");

const helper = require("../helper");
const Product = require("./Product");
const Discount = require("./Discount");
const User = require("../users/User");
const ProductService = require("./ProductService");

const productService = new ProductService();

router.use(upload.single("picture"));

router.get("/products", (req, res) => {
  Product.getAll((err, products) => {
    if (err) throw err;
    res.json(products);
  });
});

router.use(verifyToken);
router.use(verifyAdmin);

router.post("/products/create", async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.file);
    res.json(product);
  } catch (err) {
    next(err);
  } finally {
    await fs.promises.unlink(req.file.path);
  }
});

router.post("/products/edit/:id", async (req, res, next) => {
  try {
    const form = {
      ...req.body,
      picture: req.file
    }
    const product = await productService.updateProductById(form, req.params.id);

    // have to do it this way because the front-end needs it this way
    product.discountObj = [];

    if (product.discount) {
      product.discountObj.push(product.discount);
    }

    res.json(product);
  } catch (err) {
    next(err);
  } finally {
    if (req.file) {
      await fs.promises.unlink(req.file.path);
    }
  }
});

router.delete("/products/delete/:id", async (req, res, next) => {
  try {
    await productService.deleteProductById(req.params.id);
    res.send();
  } catch (err) {
    next(err);
  }
});

router.post("/products/discount/create/:id", GetProduct, (req, res) => {
  if (req.product.discount) {
    return res.status(400).json({ message: "Product already has a discount" });
  }
  const newDiscount = new Discount({
    price: req.body.newPrice,
    expiresAt: req.body.expireAt,
    productID: req.product._id
  });
  newDiscount
    .save()
    .then(discount => {
      Product.findByIdAndUpdate(
        req.product._id,
        { $set: { discount: discount._id } },
        { new: true },
        (err, product) => {
          if (err) throw err;
          product = product.toObject();
          product.discountObj = [discount];
          res.json(product);
        }
      );
    })
    .catch(err => {
      res.json({ message: "There was a validation error" });
      throw err;
    });
});

router.post("/products/discount/edit/:id", GetProduct, (req, res) => {
  const update = {
    $set: {
      price: req.body.newPrice,
      expiresAt: req.body.expireAt
    }
  };

  Discount.findByIdAndUpdate(
    req.product.discount,
    update,
    { new: true },
    (err, discount) => {
      if (err) throw err;
      if (!discount) {
        res
          .status(400)
          .json({ message: "Product does not have a discount already" });
      }
      const product = req.product.toObject();
      product.discountObj = [discount];
      res.json(product);
    }
  );
});

router.delete("/products/discounts/delete/:id", (req, res) => {
  Product.findByIdAndUpdate(
    req.params.id,
    { $unset: { discount: "" } },
    (err, product) => {
      if (err) throw err;
      Discount.findByIdAndDelete(product.discount, err => {
        if (err) throw err;
        product = product.toObject();
        product.discountObj = [];
        res.send(product);
      });
    }
  );
});

router.get("/analytics", async (req, res) => {
  let message = {
    product: {}
  };
  await User.findOne({ email: "jacquezwilliams15@gmail.com" })
    .explain()
    .then(stat => {
      const {
        nReturned: returned,
        totalKeysExamined: keys,
        totalDocsExamined: exam
      } = stat.executionStats;
      message.product.find = { returned, keys, exam };
    });
  res.send(message);
});

router.use((req, res) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      if (err) throw err;
    });
  }
});

function GetProduct(req, res, next) {
  Product.findById(req.params.id, (err, product) => {
    if (err) {
      if (err.name === "CastError") {
        return res.status(400).json({ message: "ID is invalid" });
      } else {
        throw err;
      }
    }
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    req.product = product;
    next();
  });
}

module.exports = router;
