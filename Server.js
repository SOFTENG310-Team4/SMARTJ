const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

// Multer will handle file uploads from memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

const app = express(); // Initialise the express app

// Sets middleware to handle JSON and CORS.  Will parse incoming JSON requests and allows the use of other domains
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// Set server port, and the JWT secret key that is used to sign tokens
const PORT = process.env.PORT || 5000;
const JWT_SECRET = "JWTSuperSecretKey";

// Connect to MongoDB at the specified URL
mongoose.connect("mongodb://localhost:27017/smartj");

// Define a schema for the "User" collection in MongoDB
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
          gptFeedback: { type: String },
          medianScore: { type: Number },
          duration: { type: Number },
          questions: [
            {
              question: { type: String },  // The questions that are asked during the specific session
              answer: { type: String },    // The user's answers in response to the asked questions
            },
          ],
        },
      ],
    },
  },
});

const User = mongoose.model("User", userSchema);

// Register Endpoint for creating new users
app.post("/api/register", async (req, res) => {
  const { email, password, name } = req.body;

  // Allocating a default profile picture to the user
  const defaultProfilePicturePath = "public/images/blank-profile-picture.png";
  const defaultProfilePicture = {
    data: fs.readFileSync(defaultProfilePicturePath),
    contentType: "image/png",
  };

  // Validation of input data
  const checkEmail = email.toString().trim().toLowerCase();
  const checkPassword = password.toString();
  const checkName = name.toString().trim();

  try {
    // Hashes the password using bcrypt, via factor of 10
    const hashedPassword = await bcrypt.hash(checkPassword, 10);
    // Creates a new user object
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

    // Afterwards, saves the new user to the database
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Error response
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while registering the user" });
  }
});

// Login Endpoint, used for authenticating users
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Making sure no malicious content is passed in; validation for missing credentials
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Cleans the input data, then finds the user via email within the database
    const checkEmail = email.toString().trim().toLowerCase();
    const checkPassword = password.toString();

    console.log(checkEmail);

    const user = await User.findOne({ email: checkEmail }).lean();
    console.log(user);

    //  If such user is not found or password does not match:
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (await bcrypt.compare(checkPassword, user.password)) {
      // Creates JWT token, and responds with the token
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

// Profile retrieval endpoint [GET]
app.get("/api/profile", async (req, res) => {
  try {
    // Extracts the token from authorisation header, then verifies the token using the secret, and then finds the user by their ID
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    // Validation for if the user is not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user.profile);
    console.log(user.profile.analytics);
    res.json(user.profile); // Use res.json; returns the user's profile
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the profile" });
  }
});

// Update Profile Endpoint [PUT]
app.put("/api/profile", upload.single("profilePicture"), async (req, res) => {
  try {
    // Will verify the token and get their user ID
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the profile with new data, if it is provided
    user.profile = req.body.profile
      ? JSON.parse(req.body.profile)
      : user.profile;

    // If a new profile picture is uplodaded, then we update it
    if (req.file) {
      user.profile.profilePicture = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Saves the updated user profile to the database
    await user.save();
    res.json(user.profile); // Return updated profile
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

// Delete User Endpoint [DELETE]
app.delete("/api/profile", async (req, res) => {
  try {
    // Verify the actual token and get the user ID
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const deletedUser = await User.findByIdAndDelete(decoded.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Upload user feedback endpoint [POST]
app.post("/api/feedback", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Deconstruct the feedback details from the request body into the variables
    const { questions, answers, feedback, duration, date } = req.body;

    // Extract the numeric score from the feedback via regex
    const feedbackMatch = feedback.match(/\d+/);
    const medianScore = feedbackMatch ? parseInt(feedbackMatch[0], 10) : 0;

    // Create a new session with the feedback data
    const newSession = {
      id: new mongoose.Types.ObjectId().toString(),
      date: new Date(date),
      medianScore: medianScore,
      gptFeedback: feedback,
      duration: parseInt(duration, 10),
      questions: questions.split("\n").map((question, index) => ({
        question,
        answer: answers.split("\n")[index] || "", // Match answers to corresponding questions
      })),
    };

    // Pushes the new session into the user's analytics and saves the updated user profile
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

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
