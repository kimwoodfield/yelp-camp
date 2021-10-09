const Campground = require("../models/campground");

module.exports.displayAllCampgrounds = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewCampgroundForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.displayCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
          path: 'reviews',
          populate: {
            path: 'author'
          }
      })
      .populate('author');
    if (!campground) {
        req.flash('error', 'No campground found!');
        return res.redirect('/campgrounds'); 
    }
    res.render("campgrounds/show", { campground });
};

module.exports.renderEditCampgroundForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);    
    if (!campground) {
        req.flash('error', 'No campground found!');
        return res.redirect('/campgrounds'); 
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground has been removed!');
    res.redirect("/campgrounds");
};