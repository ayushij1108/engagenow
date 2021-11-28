const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const categoriesRoutes = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});

app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoriesRoutes);

app.listen(port, () => {
    console.log("Backend is running")
})
