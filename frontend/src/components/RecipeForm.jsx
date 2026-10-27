import { useState } from 'react';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

export default function RecipeForm({ recipe, onSubmit, onCancel }) {
  const [values, setValues] = useState({
    name: recipe?.name ?? '',
    category: recipe?.category ?? 'Breakfast',
    ingredients: recipe?.ingredients ?? '',
    steps: recipe?.steps ?? '',
    cookingTime: recipe ? String(recipe.cookingTime) : ''
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
    setFormError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const cookingTime = Number(values.cookingTime);
    const nextErrors = {};
    for (const field of ['name', 'ingredients', 'steps']) {
      if (!values[field].trim()) nextErrors[field] = 'Please fill in this field.';
    }
    if (!Number.isInteger(cookingTime) || cookingTime < 1) {
      nextErrors.cookingTime = 'Enter a whole number greater than zero.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    setFormError('');
    try {
      await onSubmit({ ...values, name: values.name.trim(), cookingTime });
    } catch (error) {
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
      <label className="form-field">
        <span>Recipe name</span>
        <input
          autoFocus
          name="name"
          value={values.name}
          onChange={updateField}
          placeholder="e.g. Sunday tomato tart"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && <span className="field-error" id="name-error">{errors.name}</span>}
      </label>

      <div className="form-row">
        <label className="form-field">
          <span>Category</span>
          <select name="category" value={values.category} onChange={updateField}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Cooking time <span className="field-unit">(minutes)</span></span>
          <input
            name="cookingTime"
            type="number"
            min="1"
            step="1"
            value={values.cookingTime}
            onChange={updateField}
            placeholder="30"
            aria-invalid={Boolean(errors.cookingTime)}
            aria-describedby={errors.cookingTime ? 'time-error' : undefined}
          />
          {errors.cookingTime && <span className="field-error" id="time-error">{errors.cookingTime}</span>}
        </label>
      </div>

      <label className="form-field">
        <span>Ingredients <span className="field-unit">(one per line)</span></span>
        <textarea
          name="ingredients"
          rows="5"
          value={values.ingredients}
          onChange={updateField}
          placeholder={'2 ripe tomatoes\n1 tbsp olive oil\nA pinch of sea salt'}
          aria-invalid={Boolean(errors.ingredients)}
          aria-describedby={errors.ingredients ? 'ingredients-error' : undefined}
        />
        {errors.ingredients && <span className="field-error" id="ingredients-error">{errors.ingredients}</span>}
      </label>

      <label className="form-field">
        <span>Preparation <span className="field-unit">(one step per line)</span></span>
        <textarea
          name="steps"
          rows="5"
          value={values.steps}
          onChange={updateField}
          placeholder={'Preheat the oven.\nPrepare the ingredients.\nServe while warm.'}
          aria-invalid={Boolean(errors.steps)}
          aria-describedby={errors.steps ? 'steps-error' : undefined}
        />
        {errors.steps && <span className="field-error" id="steps-error">{errors.steps}</span>}
      </label>

      {formError && <p className="form-error" role="alert">{formError}</p>}
      <div className="form-actions">
        <button className="button button--quiet" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="button button--primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : recipe ? 'Save changes' : 'Add to collection'}
        </button>
      </div>
    </form>
  );
}