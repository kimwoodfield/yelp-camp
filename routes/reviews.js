const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsyncError = require('../utils/catchAsyncError');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const review = require('../controllers/review');

router.post('/', isLoggedIn, validateReview, catchAsyncError(review.createReview));
  
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsyncError(review.deleteReview));

module.exports = router;