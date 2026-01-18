//controller for creating new categories
const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require("slugify");

exports.addCategory = (req, res) => {
  const { name, description } = req.body;

  let categoryImages = [];

  if (req.files.length > 0) {
    categoryImages = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  const categoryObj = {
    name,
    slug: slugify(name),
    description,
    categoryImages,
    createdBy: req.user._id,
  };

  // Check if category with same slug already exists
  Category.findOne({ slug: categoryObj.slug }).exec((err, existingCategory) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (existingCategory) {
      return res.status(400).json({ error: "Category with this name already exists!" });
    }

    // Save only if category doesn't exist
    const cat = new Category(categoryObj);
    cat.save((err, category) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      if (category) {
        return res.status(201).json({ category, msg: "Category added successfully!" });
      }
    });
  });
};

exports.getCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err) {
      return res.status(400).json({ error: err });
    }
    if (categories) {
      //using createCategories function to store all the categories in the categoryList array

      return res.status(200).json({ categories /* categoryList */ });
    }
  });
};

exports.updateCategory = async (req, res) => {
  //saving all category images uploaded in an array
  let categoryImages = [];

  //if categoryImages exists then mapping them to a array of objects as needed in the category schema
  if (req.files.length > 0) {
    categoryImages = req.files.map((file) => {
      return { img: file.filename };
    });
  }

  try {
    await Category.findById(req.body._id).then((category) => {
      category._id = req.body._id;
      category.name = req.body.name;
      category.description = req.body.description;

      if (categoryImages.length > 0) {
        category.categoryImages = categoryImages;
      }

      category
        .save()
        .then(() =>
          res.status(201).json({ msg: "You've Updated the category!" })
        )
        .catch((err) => res.status(400).json({ error: err.message }));
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    //Check if any product is associated with this category, if yes then prevent deletion
    const productCount = await Product.countDocuments({ category: req.params.id });
    if (productCount > 0) {
      return res.status(400).json({ error: "Cannot delete category with associated products presents!" });
    }

    await Category.findByIdAndDelete(req.params.id)
      .then(() =>
        res.status(200).json({ msg: "Category Deleted Successfully!" })
      )
      .catch((err) => res.status(400).json({ error: err.message }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
