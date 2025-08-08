const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.signup = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      address,
      city,
      country,
      phone,
      about,
    } = req.body || {};

    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({ message: "Required fields are missing." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      address: address || "",
      city: city || "",
      country: country || "",
      phone: phone || "",
      about: about || "",
    });

    const savedUser = await newUser.save();

    return res
      .status(201)
      .json({ message: "User created!", userId: savedUser._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "Email and password are required." });
  }

  let loadedUser;
  try {
    const user = await User.findOne({ email: email }).select("+password");
    if (!user) {
      const error = new Error("A user with this email could not be found.");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      JWT_SECRET_KEY,
      { expiresIn: "2h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const users = await User.find().lean();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    next(err);
  }
};
