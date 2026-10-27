function lines(text) {
  return text.split('\n').map((line) => line.trim()).filter(Boolean);
}

export default function RecipeDetails({ recipe, onEdit, onDelete }) {
  return (
    <div className="recipe-detail">
      <div className="recipe-detail__meta">
        <span className={`category-tag category-tag--${recipe.category.toLowerCase()}`}>
          {recipe.category}
        </span>
        <span className="detail-time">Ready in <strong>{recipe.cookingTime} min</strong></span>
      </div>
      <div className="recipe-detail__columns">
        <section>
          <h3>Ingredients</h3>
          <ul className="ingredient-list">
            {lines(recipe.ingredients).map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}
          </ul>
        </section>
        <section>
          <h3>Method</h3>
          <ol className="method-list">
            {lines(recipe.steps).map((step, index) => <li key={`${step}-${index}`}><span>{step}</span></li>)}
          </ol>
        </section>
      </div>
      <div className="detail-actions">
        <button className="button button--quiet" type="button" onClick={onDelete}>Delete recipe</button>
        <button className="button button--primary" type="button" onClick={onEdit}>Edit recipe</button>
      </div>
    </div>
  );
}