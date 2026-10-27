export default function RecipeCard({ recipe, onOpen, isActive, position }) {
  return (
    <article
      className={`recipe-card${isActive ? ' recipe-card--active' : ''}`}
      data-position={position}
      aria-current={isActive ? 'true' : undefined}
    >
      <button
        className="recipe-card__open"
        type="button"
        onClick={onOpen}
        tabIndex={position === 'hidden' ? -1 : 0}
        aria-label={`View ${recipe.name}${isActive ? ', selected recipe' : ''}`}
      >
        <div className="recipe-card__topline">
          <span className={`category-tag category-tag--${recipe.category.toLowerCase()}`}>
            {recipe.category}
          </span>
          <span className="recipe-card__index" aria-hidden="true">
            {recipe.name.slice(0, 1).toUpperCase()}
          </span>
        </div>
        <h3>{recipe.name}</h3>
        <p className="recipe-card__summary">
          {recipe.ingredients.split('\n').filter(Boolean).slice(0, 3).join(' · ')}
        </p>
        <span className="recipe-card__footer">
          <span><span className="recipe-card__clock" aria-hidden="true">◷</span> {recipe.cookingTime} min</span>
          <span className="recipe-card__arrow" aria-hidden="true">{isActive ? '↗' : '＋'}</span>
        </span>
      </button>
    </article>
  );
}