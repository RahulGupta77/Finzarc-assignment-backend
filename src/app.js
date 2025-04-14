const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDb = require("./config/database");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://finzarc.rahulgupta.tech",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.options("*", cors());

app.use("/v1", routes);

app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  res.status(400).send(err.message);
});

connectDb()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(8000, (req, res) => {
      console.log("server started on port 8000...");
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
