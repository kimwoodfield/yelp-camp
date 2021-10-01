const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utils/catchAsyncError');
const ExpressError = require('../utils/ExpressError');
const Campground = require("../models/campground");
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  }

router.get("/", catchAsyncError(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  }));
  
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  router.post("/", validateCampground, catchAsyncError(async (req, res, next) => {
      // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
      const campground = new Campground(req.body.campground);
      await campground.save();
      req.flash('success', 'Successfully made a new campground!');
      res.redirect(`/campgrounds/${campground.id}`);
  }));
  
  router.get("/:id", catchAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'No campground found!');
        return res.redirect('/campgrounds'); 
    }
    res.render("campgrounds/show", { campground });
  }));
  
  router.get("/:id/edit", catchAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id);    
    if (!campground) {
        req.flash('error', 'No campground found!');
        return res.redirect('/campgrounds'); 
    }
    res.render("campgrounds/edit", { campground });
  }));
  
  router.put("/:id", validateCampground, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground.id}`);
  }));
  
  router.delete("/:id", catchAsyncError(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground has been removed!');
    res.redirect("/campgrounds");
  }));

  module.exports = router;