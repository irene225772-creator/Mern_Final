const RECIPE_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

function validateRecipeInput(input) {
  const errors = {};
  const value = input && typeof input === 'object' && !Array.isArray(input) ? input : {};
  const data = {
    name: typeof value.name === 'string' ? value.name.trim() : '',
    category: typeof value.category === 'string' ? value.category.trim() : '',
    ingredients: typeof value.ingredients === 'string' ? value.ingredients.trim() : '',
    steps: typeof value.steps === 'string' ? value.steps.trim() : '',
    cookingTime: value.cookingTime
  };

  for (const field of ['name', 'ingredients', 'steps']) {
    if (!data[field]) errors[field] = 'This field is required.';
  }

  if (!RECIPE_CATEGORIES.includes(data.category)) {
    errors.category = `Choose one of: ${RECIPE_CATEGORIES.join(', ')}.`;
  }

  if (!Number.isInteger(data.cookingTime) || data.cookingTime < 1) {
    errors.cookingTime = 'Cooking time must be a positive whole number.';
  }

  return { data, errors };
}

module.exports = { RECIPE_CATEGORIES, validateRecipeInput };