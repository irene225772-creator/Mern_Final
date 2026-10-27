const express = require('express');
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const asyncHandler = require('../middleware/asyncHandler');
const { validateRecipeInput } = require('../validation/recipe');

const router = express.Router();

function validId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

function validateBody(req, res) {
  const { data, errors } = validateRecipeInput(req.body);
  if (Object.keys(errors).length) {
    res.status(400).json({ error: 'Check the recipe details and try again.', details: errors });
    return null;
  }
  return data;
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const recipes = await Recipe.find().sort({ updatedAt: -1 });
    res.json(recipes);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!validId(req.params.id) || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Recipe id must be a valid MongoDB id.' });
    }
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    res.json(recipe);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const data = validateBody(req, res);
    if (!data) return;
    const recipe = await Recipe.create(data);
    res.status(201).json(recipe);
  })
);

router.put(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!validId(req.params.id) || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Recipe id must be a valid MongoDB id.' });
    }
    const data = validateBody(req, res);
    if (!data) return;
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true
    });
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    res.json(recipe);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!validId(req.params.id) || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Recipe id must be a valid MongoDB id.' });
    }
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found.' });
    res.json({ message: 'Recipe deleted.' });
  })
);

module.exports = router;