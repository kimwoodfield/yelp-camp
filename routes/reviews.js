const express = require('express');
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require('../models/review');

const catchAsyncError = require('../utils/catchAsyncError');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schemas.js');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  }


router.post('/', validateReview, catchAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added!');
    res.redirect(`/campgrounds/${campground._id}`);
  }));
  
  router.delete('/:reviewId', catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'This review has been removed');
    res.redirect(`/campgrounds/${id}`);
  }));

  module.exports = router;