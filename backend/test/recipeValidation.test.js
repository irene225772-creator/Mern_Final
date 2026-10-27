const test = require('node:test');
const assert = require('node:assert/strict');
const { validateRecipeInput } = require('../src/validation/recipe');

const validRecipe = {
  name: '  Tomato toast  ',
  category: 'Lunch',
  ingredients: 'Bread\nTomato',
  steps: 'Toast bread\nAdd tomato',
  cookingTime: 8
};

test('trims text and accepts a complete recipe', () => {
  const result = validateRecipeInput(validRecipe);
  assert.deepEqual(result.errors, {});
  assert.equal(result.data.name, 'Tomato toast');
  assert.equal(result.data.ingredients, 'Bread\nTomato');
});

test('requires a supported category and positive integer cooking time', () => {
  const result = validateRecipeInput({ ...validRecipe, category: 'Brunch', cookingTime: 2.5 });
  assert.ok(result.errors.category);
  assert.ok(result.errors.cookingTime);
});

test('rejects missing multiline content', () => {
  const result = validateRecipeInput({ ...validRecipe, ingredients: '  ', steps: '' });
  assert.ok(result.errors.ingredients);
  assert.ok(result.errors.steps);
});