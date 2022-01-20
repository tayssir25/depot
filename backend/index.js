const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileCheck = require("./routes/fileCheck");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
  "mongodb://localhost:27017/DEPOT",
  { UseNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (!err) {
      console.log("successfully connected ! ");
    } else {
      console.log("error connection to the data base !");
      console.log(err);
    }
  }
);

const connection = mongoose.connection;
connection.once("open", () => {
  console.clear();
  console.log("MongoDB");
});

app.use("/fileCheck", fileCheck);

app.listen(5000, () => {
    console.log("backend server is running on port 5000");
  });
  