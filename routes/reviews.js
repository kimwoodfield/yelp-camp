const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campground");
const Review = require('../models/review');
const catchAsyncError = require('../utils/catchAsyncError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

router.post('/', isLoggedIn, validateReview, catchAsyncError(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Review added!');
    res.redirect(`/campgrounds/${campground._id}`);
  }));
  
  router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'This review has been removed');
    res.redirect(`/campgrounds/${id}`);
  }));

  module.exports = router;