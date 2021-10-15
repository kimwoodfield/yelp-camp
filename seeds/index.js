const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

console.log("We are inside of the index.js under seeds folder");

mongoose.connect("mongodb://localhost:27017/yelp-camp-clone", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected.");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 1;
    const camp = new Campground({
      author: '6157b37bd4841c3048947598',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci, ducimus numquam, fugiat corrupti odio error voluptatum quidem dolorem eligendi facere velit nulla necessitatibus quas molestias dolor minus eum tenetur beatae.',
      price,
      geometry: {
        type : "Point", 
        coordinates: [ -113.1331, 47.0202 ] 
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dcmbiwych/image/upload/v1633947817/YelpCamp/wy0zoy4p3dd4dmidqpmi.jpg',
          filename: 'YelpCamp/mk6c9bqwnlkxgvxykqao'
        },
        {
          url: 'https://res.cloudinary.com/dcmbiwych/image/upload/v1633945521/YelpCamp/izcwni71pnlreieynsru.jpg',
          filename: 'YelpCamp/brvqx4qsozp88mpbrdof'
        }
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
