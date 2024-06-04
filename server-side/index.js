const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const userRouter = require("./routes/user_routes");
const medicineRouter = require("./routes/medicine_routes");
const cartRouter = require("./routes/cart_routes");
const orderRouter = require('./routes/order_routes');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Connect to online MongoDB
const url = process.env.MONGOURL;
mongoose.connect(url, () => {
  console.log("Connected to Atlas MongoDB");
});

// Multer configuration for handling file uploads
const upload = multer({ dest: "uploads/" });

// Route for handling image uploads
app.post("/detect_text", upload.single("image"), async (req, res) => {
  try {
    // Read the uploaded image file
    const imageData = fs.readFileSync(req.file.path);

    // Forward the uploaded image to the Flask API for text detection
    const formData = new FormData();
    formData.append("image", imageData, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const flaskResponse = await axios.post(
      "http://localhost:5000/detect_text",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    // Return the text detected by the Flask API
    res.send(flaskResponse.data);
  } catch (error) {
    console.error("Error processing image:", error);
    res
      .status(500)
      .send({ error: "An error occurred while processing the image" });
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(__dirname + "/images"));

// Routes
app.use("/api/users", userRouter);
app.use("/api/medicines", medicineRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Medicine Store Project");
});

app.listen(port, () => {
  console.log(`Connected to http://localhost:${port}`);
});
