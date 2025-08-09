const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().lean();
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  try {
    // Support deletion by numeric `id` field or MongoDB `_id`
    const numericId = Number(productId);
    const query = Number.isNaN(numericId)
      ? { _id: productId }
      : { id: numericId };

    const product = await Product.findOne(query);

    if (!product) {
      const error = new Error("Could not find product.");
      error.statusCode = 404;
      throw error;
    }

    await Product.deleteOne(query);

    res.status(200).json({ message: "Deleted product." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.stats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalCategories = await Product.distinct("category").then(
      (cats) => cats.length
    );

    const totalCustomers = await Product.distinct("customer_email").then(
      (cust) => cust.length
    );

    const totalOrders = await Product.countDocuments();

    const totalPrice = await Product.aggregate([
      { $group: { _id: null, sum: { $sum: "$total_price" } } },
    ]).then((result) => (result.length > 0 ? result[0].sum : 0));

    res.json({
      total_product: totalProducts,
      total_categories: totalCategories,
      total_orders: totalOrders,
      total_sales: totalPrice,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//last six months sales and total orders

exports.salesAndOrders = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // includes current month

    const data = await Product.aggregate([
      {
        $addFields: {
          orderDate: { $toDate: "$date_ordered" },
        },
      },
      {
        $match: {
          orderDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$orderDate" } },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalSales: { $sum: "$total_price" },
        },
      },
      {
        $sort: { "_id.month": 1 },
      },
      {
        $addFields: {
          monthName: {
            $arrayElemAt: [
              [
                "",
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              "$_id.month",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          monthName: 1,
          totalOrders: 1,
          totalQuantity: 1,
          totalSales: 1,
        },
      },
      {
        $sort: { "_id.month": 1 }, // correct month order
      },
    ]);

    // Convert to desired object format
    const result = {};
    data.forEach((item) => {
      result[item.monthName] = {
        totalOrders: item.totalOrders,
        totalQuantity: item.totalQuantity,
        totalSales: item.totalSales,
      };
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// fetch first five supplier data and category data

exports.suppliersAndCategories = async (req, res, next) => {
  try {
    // First five suppliers with aggregated data (rounded)
    const suppliers = await Product.aggregate([
      {
        $group: {
          _id: "$supplier",
          Quantity: { $sum: "$quantity" },
          Unit: { $first: "$unit_price" },
          Price: { $sum: "$total_price" },
        },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          Name: "$_id",
          Quantity: { $round: ["$Quantity", 0] },
          Unit: { $round: ["$Unit", 0] },
          Price: { $round: ["$Price", 0] },
        },
      },
    ]);

    // First five categories with aggregated data (rounded)
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          Quantity: { $sum: "$quantity" },
          Price: { $sum: "$total_price" },
        },
      },
      { $limit: 5 },
      {
        $project: {
          _id: 0,
          "Category name": "$_id",
          Quantity: { $round: ["$Quantity", 0] },
          Price: { $round: ["$Price", 0] },
        },
      },
    ]);

    res.json({
      "Supplier data": suppliers,
      "Category data": categories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// fetch all supplier data
exports.suppliers = async (req, res, next) => {
  try {
    const suppliers = await Product.aggregate([
      {
        $group: {
          _id: "$supplier",
          Quantity: { $sum: "$quantity" },
          Unit: { $first: "$unit_price" },
          Price: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0,
          Name: "$_id",
          Quantity: { $round: ["$Quantity", 0] },
          Unit: { $round: ["$Unit", 0] },
          Price: { $round: ["$Price", 0] },
        },
      },
    ]);

    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// fetch all category data
exports.categories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          Quantity: { $sum: "$quantity" },
          Price: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0,
          "Category name": "$_id",
          Quantity: { $round: ["$Quantity", 0] },
          Price: { $round: ["$Price", 0] },
        },
      },
      { $sort: { "Category name": 1 } }, // optional alphabetical sort
    ]);

    res.json({
      "Category data": categories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
