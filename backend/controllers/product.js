const Product = require("../models/product");

exports.getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // default: page 1
    const limit = parseInt(req.query.limit) || 10; // default: 10 per page
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments();

    // Get paginated results
    const products = await Product.find().skip(skip).limit(limit).lean();

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
      {
        $group: {
          _id: null,
          sum: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          sum: { $round: ["$sum", 0] }, // removes decimals
        },
      },
    ]).then((result) => (result.length > 0 ? result[0].sum : 0));

    res.json({
      total_product: Math.round(totalProducts),
      total_categories: Math.round(totalCategories),
      total_orders: Math.round(totalOrders),
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
    const startDate = new Date("2025-01-01T00:00:00Z");
    const endDate = new Date("2025-06-30T23:59:59Z");

    const data = await Product.aggregate([
      {
        $addFields: {
          orderDate: { $toDate: "$date_ordered" },
        },
      },
      {
        $match: {
          orderDate: { $gte: startDate, $lte: endDate },
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

// fetch supplier data with pagination
exports.suppliers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.distinct("supplier").then((arr) => arr.length);

    const suppliers = await Product.aggregate([
      {
        $group: {
          _id: "$supplier",
          Quantity: { $sum: "$quantity" },
          Unit: { $first: "$unit_price" },
          Price: { $sum: "$total_price" },
        },
      },
      { $sort: { _id: 1 } },
      { $skip: skip },
      { $limit: limit },
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

    const totalPages = Math.max(1, Math.ceil(total / limit));
    res.json({
      items: suppliers,
      page,
      limit,
      total,
      totalPages,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// fetch category data with pagination
exports.categories = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Product.distinct("category").then((arr) => arr.length);

    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          Quantity: { $sum: "$quantity" },
          Price: { $sum: "$total_price" },
        },
      },
      { $sort: { _id: 1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          "Category name": "$_id",
          Quantity: { $round: ["$Quantity", 0] },
          Price: { $round: ["$Price", 0] },
        },
      },
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));
    res.json({
      items: categories,
      page,
      limit,
      total,
      totalPages,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
