// import express to create our server
import express from "express";
// import mongoose to connect to our mongoDB
import { connect } from "mongoose";
// import cors for accepting request from the client during developing
import cors from "cors";
// import path for assigning directory path
import path from "path";
// create a PORT variable to run our server on
const PORT = process.env.PORT || 7000;
const app = express();

// connect to mongoDB
connect(
  "mongodb://localhost:27017/crawl",
  { useNewUrlParser: true }
);

// middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Controller
import WebsiteController from "./Controller/WebsiteController";
app.use("/api/v1", WebsiteController);

// error function
app.use(function(req, res, error) {
  if (error) {
    res
      .status(404)
      .send({ success: false, message: "an error ocurred when indexing page" });
  }
});

// server static html for our routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// start server
app.listen(PORT, () => console.log(`server listening on port: ${PORT} `));
