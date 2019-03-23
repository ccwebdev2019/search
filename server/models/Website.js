// import mongoose for creating our Schema
const mongoose = require("mongoose");
// create variable storing Schema
const Schema = mongoose.Schema;

// create a new Schema
const WebsiteSchema = Schema({
  url: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  data: {
    type: String,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

// search for words on the property data with $text index
WebsiteSchema.index({ data: "text" });

// export our schema as a model
module.exports = mongoose.model("Website", WebsiteSchema);
