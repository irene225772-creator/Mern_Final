import { useEffect, useState } from 'react';
import Dialog from './components/Dialog.jsx';
import RecipeCard from './components/RecipeCard.jsx';
import RecipeDetails from './components/RecipeDetails.jsx';
import RecipeForm from './components/RecipeForm.jsx';
import { createRecipe, deleteRecipe, getRecipes, updateRecipe } from './api/recipes.js';

const categories = ['All recipes', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loadState, setLoadState] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All recipes');
  const [dialog, setDialog] = useState(null);
  const [notice, setNotice] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeRecipeId, setActiveRecipeId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoadState('loading');
    getRecipes(controller.signal)
      .then((result) => {
        setRecipes(result);
        setLoadState('ready');
        setLoadError('');
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setLoadError(error.message);
        setLoadState('error');
      });
    return () => controller.abort();
  }, [reloadKey]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const searchTerm = query.trim().toLowerCase();
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = category === 'All recipes' || recipe.category === category;
    const matchesSearch = !searchTerm
      || recipe.name.toLowerCase().includes(searchTerm)
      || recipe.category.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  async function saveRecipe(values) {
    if (dialog.recipe) {
      const updated = await updateRecipe(dialog.recipe._id, values);
      setRecipes((current) => current.map((recipe) => recipe._id === updated._id ? updated : recipe));
      setNotice({ type: 'success', text: 'Recipe changes saved.' });
    } else {
      const created = await createRecipe(values);
      setRecipes((current) => [created, ...current]);
      setActiveRecipeId(created._id);
      setNotice({ type: 'success', text: 'Recipe added to your collection.' });
    }
    setDialog(null);
  }

  async function removeRecipe() {
    setDeleting(true);
    try {
      await deleteRecipe(dialog.recipe._id);
      setRecipes((current) => current.filter((recipe) => recipe._id !== dialog.recipe._id));
      setActiveRecipeId((current) => current === dialog.recipe._id ? null : current);
      setDialog(null);
      setNotice({ type: 'success', text: 'Recipe removed from your collection.' });
    } catch (error) {
      setNotice({ type: 'error', text: error.message });
    } finally {
      setDeleting(false);
    }
  }

  function openForm(recipe = null) {
    setDialog({ type: 'form', recipe });
  }

  const activeRecipeIndex = Math.max(
    0,
    filteredRecipes.findIndex((recipe) => recipe._id === activeRecipeId)
  );

  function moveSelection(direction) {
    if (!filteredRecipes.length) return;
    const nextIndex = (activeRecipeIndex + direction + filteredRecipes.length) % filteredRecipes.length;
    setActiveRecipeId(filteredRecipes[nextIndex]._id);
  }

  return (
    <div className="page-shell">
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="The Kitchen Ledger home">
          <span className="wordmark__seal" aria-hidden="true">K</span>
          <span>The Kitchen Ledger</span>
        </a>
        <div className="masthead__edition"><span className="status-dot" /> YOUR PERSONAL RECIPE ARCHIVE</div>
        <button className="button button--primary masthead__add" type="button" onClick={() => openForm()}>
          <span className="button__plus" aria-hidden="true">+</span> Add a recipe
        </button>
      </header>

      <main id="top">
        <section className="intro" aria-labelledby="intro-title">
          <div className="intro__copy">
            <p className="eyebrow"><span>VOL. 01</span><span className="eyebrow__rule" /> MADE IN YOUR KITCHEN</p>
            <h1 id="intro-title">Recipes worth<br /><em>keeping.</em></h1>
            <p className="intro__description">A growing record of the meals you love, the ones you make your own, and the ones worth passing around.</p>
            <div className="intro__count"><strong>{recipes.length.toString().padStart(2, '0')}</strong><span>recipes<br />collected</span></div>
          </div>
          <div className="intro__image-wrap">
            <img
              className="intro__image"
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=85"
              alt="A colorful spread of fresh vegetables and prepared food"
            />
            <span className="image-caption">THE JOY IS IN THE MAKING</span>
            <span className="image-index" aria-hidden="true">01</span>
          </div>
        </section>

        <section className="collection" aria-labelledby="collection-title">
          <div className="collection__heading">
            <div>
              <p className="eyebrow"><span>THE COLLECTION</span><span className="eyebrow__rule" /></p>
              <h2 id="collection-title">Your recipe shelf</h2>
            </div>
            <span className="collection__total">{recipes.length} {recipes.length === 1 ? 'entry' : 'entries'}</span>
          </div>

          <div className="collection-tools">
            <label className="search-box">
              <span className="sr-only">Search recipes by name or category</span>
              <span className="search-box__icon" aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your recipes" />
            </label>
            <label className="filter-box">
              <span className="sr-only">Filter by category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          </div>

          {loadState === 'loading' && (
            <div className="collection-state" role="status"><span className="loading-mark" /> Gathering your recipes…</div>
          )}
          {loadState === 'error' && (
            <div className="collection-state collection-state--error" role="alert">
              <h3>Your recipe shelf could not load.</h3>
              <p>{loadError}</p>
              <button className="button button--quiet" type="button" onClick={() => setReloadKey((key) => key + 1)}>Try again</button>
            </div>
          )}
          {loadState === 'ready' && filteredRecipes.length > 0 && (
            <div className="recipe-carousel" role="region" aria-label="Recipe carousel">
              <div className="carousel-stage">
                {filteredRecipes.map((recipe, index) => {
                  const rawOffset = index - activeRecipeIndex;
                  const offset = ((rawOffset + filteredRecipes.length / 2) % filteredRecipes.length
                    + filteredRecipes.length) % filteredRecipes.length - filteredRecipes.length / 2;
                  const isActive = index === activeRecipeIndex;
                  return (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      isActive={isActive}
                      position={Math.abs(offset) > 2 ? 'hidden' : offset}
                      onOpen={() => {
                        setActiveRecipeId(recipe._id);
                        setDialog({ type: 'details', recipe });
                      }}
                    />
                  );
                })}
              </div>
              <div className="carousel-controls">
                <button
                  className="carousel-arrow"
                  type="button"
                  onClick={() => moveSelection(-1)}
                  aria-label="Show previous recipe"
                  disabled={filteredRecipes.length < 2}
                >
                  <span aria-hidden="true">←</span>
                </button>
                <p className="carousel-caption" aria-live="polite">
                  <span>{String(activeRecipeIndex + 1).padStart(2, '0')}</span>
                  <span className="carousel-caption__rule" />
                  <span>{String(filteredRecipes.length).padStart(2, '0')}</span>
                  <span className="carousel-caption__name">{filteredRecipes[activeRecipeIndex].name}</span>
                </p>
                <button
                  className="carousel-arrow"
                  type="button"
                  onClick={() => moveSelection(1)}
                  aria-label="Show next recipe"
                  disabled={filteredRecipes.length < 2}
                >
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          )}
          {loadState === 'ready' && filteredRecipes.length === 0 && (
            <div className="collection-state collection-state--empty">
              <span className="empty-mark" aria-hidden="true">+</span>
              <h3>{recipes.length ? 'Nothing on this shelf.' : 'The first page is yours.'}</h3>
              <p>{recipes.length ? 'Try another search or category.' : 'Add a recipe and start your personal collection.'}</p>
              {!recipes.length && <button className="button button--primary" type="button" onClick={() => openForm()}>Add your first recipe</button>}
            </div>
          )}
        </section>
      </main>

      <footer className="page-footer">
        <span>THE KITCHEN LEDGER</span><span>GOOD FOOD, KEPT CLOSE.</span><span>EST. IN YOUR KITCHEN</span>
      </footer>

      {notice && (
        <div className={`notice notice--${notice.type}`} role={notice.type === 'error' ? 'alert' : 'status'}>
          <span>{notice.text}</span>
          <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message">×</button>
        </div>
      )}

      {dialog?.type === 'form' && (
        <Dialog title={dialog.recipe ? 'Edit this recipe' : 'Add a recipe'} onClose={() => setDialog(null)} wide>
          <RecipeForm recipe={dialog.recipe} onSubmit={saveRecipe} onCancel={() => setDialog(null)} />
        </Dialog>
      )}
      {dialog?.type === 'details' && (
        <Dialog title={dialog.recipe.name} onClose={() => setDialog(null)} wide>
          <RecipeDetails
            recipe={dialog.recipe}
            onEdit={() => openForm(dialog.recipe)}
            onDelete={() => setDialog({ type: 'delete', recipe: dialog.recipe })}
          />
        </Dialog>
      )}
      {dialog?.type === 'delete' && (
        <Dialog title="Remove this recipe?" onClose={() => setDialog(null)}>
          <div className="delete-confirmation">
            <p><strong>{dialog.recipe.name}</strong> will be removed from your collection. This cannot be undone.</p>
            <div className="form-actions">
              <button className="button button--quiet" type="button" onClick={() => setDialog(null)} disabled={deleting}>Keep recipe</button>
              <button className="button button--danger" type="button" onClick={removeRecipe} disabled={deleting}>
                {deleting ? 'Removing…' : 'Remove recipe'}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}