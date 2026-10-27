const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const app = require('../src/app');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  });
});

test('rejects malformed MongoDB ids before querying the database', async () => {
  const response = await fetch(`${baseUrl}/api/recipes/not-an-id`);
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.match(body.error, /valid MongoDB id/i);
});

test('returns field-level errors for an incomplete recipe request', async () => {
  const response = await fetch(`${baseUrl}/api/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: ' ', category: 'Brunch', cookingTime: 0 })
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.ok(body.details.name);
  assert.ok(body.details.category);
  assert.ok(body.details.ingredients);
  assert.ok(body.details.steps);
  assert.ok(body.details.cookingTime);
});

test('returns a useful error for malformed JSON', async () => {
  const response = await fetch(`${baseUrl}/api/recipes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{'
  });
  const body = await response.json();
  assert.equal(response.status, 400);
  assert.match(body.error, /valid JSON/i);
});