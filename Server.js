const express = require("express");
const mongoose = require("mongoose");
const bcrrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = "JWTSuperSecretKey";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/smartj");

// Define a schema for the user collection
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: String,
    progress: Array,
    analytics: Object,
  },
});

const User = mongoose.model("User", userSchema);

// Register Endpoint
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user" });
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  if (await bcrrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET);

    return res.status(200).json({ token });
  }

  res.status(400).send("Invalid email or password");
});

app.get("/api/profile", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.userId);
  res.send.json(user.profile);
});

// Update Profile Endpoint
app.put("/api/profile", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.userId);
  user.profile = req.body.profile;
  await user.save();
  res.send.json(user.profile);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
