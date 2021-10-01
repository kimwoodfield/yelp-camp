const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) { 
  console.log('deleted!');
});

module.exports = mongoose.model("Campground", CampgroundSchema);
