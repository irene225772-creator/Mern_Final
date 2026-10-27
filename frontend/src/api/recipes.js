async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(path, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers }
    });
  } catch {
    throw new Error('Could not reach the recipe server. Check that the backend is running.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'The request could not be completed.');
  return result;
}

export function getRecipes(signal) {
  return request('/api/recipes', { signal });
}

export function createRecipe(recipe) {
  return request('/api/recipes', { method: 'POST', body: JSON.stringify(recipe) });
}

export function updateRecipe(id, recipe) {
  return request(`/api/recipes/${id}`, { method: 'PUT', body: JSON.stringify(recipe) });
}

export function deleteRecipe(id) {
  return request(`/api/recipes/${id}`, { method: 'DELETE' });
}