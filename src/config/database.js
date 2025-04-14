const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://rahulguptaatlas:gwtTmYx5UKzfcsTY@cluster0.3pa7dgo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
};

module.exports = connectDb;
