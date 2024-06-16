const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // Đúng tên gói
const authRouter = require("./routes/authRoute");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error", err));

app.use("/auth", authRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
