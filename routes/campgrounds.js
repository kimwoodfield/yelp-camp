const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utils/catchAsyncError');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsyncError(campgrounds.displayAllCampgrounds))
    .post(isLoggedIn, validateCampground, catchAsyncError(campgrounds.createCampground))

router.get("/new", isLoggedIn, campgrounds.renderNewCampgroundForm);

router.route('/:id')
    .get(catchAsyncError(campgrounds.displayCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsyncError(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsyncError(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsyncError(campgrounds.renderEditCampgroundForm));

module.exports = router;