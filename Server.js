const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const app = express();
app.use(express.json({ limit: "50mb" }));
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
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    // Analytics will contain an array with session objects, within the session objects will be the session id, date, and median score for a user. it will also contain the questions answered by the user and the answers given by the user.
    analytics: {
      sessions: [
        {
          id: { type: String },
          date: { type: Date },
          medianScore: { type: Number },
          duration: { type: Number },
          questions: [
            {
              question: { type: String },
              answer: { type: String },
            },
          ],
        },
      ],
    },
  },
});

const User = mongoose.model("User", userSchema);

// Register Endpoint
app.post("/api/register", async (req, res) => {
  const { email, password, name } = req.body;
  const defaultProfilePicturePath = "public/images/blank-profile-picture.png";
  const defaultProfilePicture = {
    data: fs.readFileSync(defaultProfilePicturePath),
    contentType: "image/png",
  };

  const checkEmail = email.toString().trim().toLowerCase();
  const checkPassword = password.toString();
  const checkName = name.toString().trim();

  try {
    const hashedPassword = await bcrypt.hash(checkPassword, 10);
    const newUser = new User({
      email: checkEmail,
      password: hashedPassword,
      profile: {
        name: checkName,
        profilePicture: defaultProfilePicture,
        progress: [],
        analytics: {},
      },
    });
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
  try {
    const { email, password } = req.body;

    // Making sure no malicious content is passed in
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const checkEmail = email.toString().trim().toLowerCase();
    const checkPassword = password.toString();

    console.log(checkEmail);

    const user = await User.findOne({ email: checkEmail }).lean();
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (await bcrypt.compare(checkPassword, user.password)) {
      const token = jwt.sign({ email: user.email, id: user._id }, JWT_SECRET);

      console.log(token);
      return res.status(200).json({ token });
    } else {
      return res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
});

app.get("/api/profile", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log(user.profile);
    console.log(user.profile.analytics);
    res.json(user.profile); // Use res.json
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the profile" });
  }
});

// Update Profile Endpoint
app.put("/api/profile", upload.single("profilePicture"), async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profile = req.body.profile
      ? JSON.parse(req.body.profile)
      : user.profile;

    if (req.file) {
      user.profile.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await user.save();
    res.json(user.profile);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      // Handle Multer-specific errors
      if (error.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size too large. Max limit is 5MB." });
      }
    }
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile" });
  }
});

app.post("/api/feedback", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { questions, answers, feedback, duration, date } = req.body;

    const newSession = {
      id: new mongoose.Types.ObjectId().toString(),
      date: new Date(date),
      medianScore: parseInt(feedback.match(/\d+/)[0], 10),
      duration: parseInt(duration, 10),
      questions: questions.split("\n").map((question, index) => ({
        question,
        answer: answers.split("\n")[index] || "",
      })),
    };

    user.profile.analytics.sessions.push(newSession);
    await user.save();

    res.status(200).json({ message: "Feedback saved successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while saving feedback" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
