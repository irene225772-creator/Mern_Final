const mongoose = require('mongoose');
const { RECIPE_CATEGORIES } = require('../validation/recipe');

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: RECIPE_CATEGORIES, trim: true },
    ingredients: { type: String, required: true, trim: true },
    steps: { type: String, required: true, trim: true },
    cookingTime: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'Cooking time must be a positive whole number.'
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Recipe', recipeSchema);