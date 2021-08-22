const express = require("express"),
  engine = require("ejs-mate"),
  app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const catchAsyncError = require('./utils/catchAsyncError');

app.engine("ejs", engine);

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

// const app = express();

// app.use("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("common"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/campgrounds", catchAsyncError(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", catchAsyncError(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
}));

app.get("/campgrounds/:id", catchAsyncError(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit", catchAsyncError(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground.id}`);
}));

app.delete("/campgrounds/:id", catchAsyncError(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

app.use((err, req, res, next) => {
  res.send('oh boy, something went wrong');
})

app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
