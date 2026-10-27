# The Kitchen Ledger

A personal recipe collection built with MongoDB Atlas, Express, React, and Node.js. The interface treats recipes like entries in a small editorial cookbook, while keeping the code path for each CRUD operation direct and easy to follow.

## Project structure

```text
backend/
	src/config/       MongoDB connection
	src/middleware/   Async and error handling
	src/models/       Mongoose recipe schema
	src/routes/       Recipe REST endpoints
	src/validation/   Shared server-side input rules
	test/             Node test-runner validation tests
frontend/
	src/api/          Fetch-based API client
	src/components/   Recipe card, form, details, and dialog
	src/              React app and responsive CSS
```

The recipe document stores ingredients and preparation as newline-separated strings. This keeps editing intuitive in a multiline form and avoids introducing a more complicated nested data model for this assessment. The server validates every write independently of the browser, and the Mongoose schema provides a second validation boundary before persistence.

## Requirements

- Node.js 20 LTS or newer and npm
- A MongoDB Atlas cluster and database user

## MongoDB Atlas setup

1. Sign in to MongoDB Atlas and create a project and free shared cluster.
2. In **Database Access**, create a database user with a strong unique password and only the permissions needed for this app (the built-in `readWrite` role on the application database is sufficient).
3. In **Network Access**, add your current development IP address. Do not leave access open to `0.0.0.0/0`; update the allowlist if your IP changes. For deployment, allow only the application's fixed outbound IP or use the hosting provider's private networking option.
4. Create or select a database named `recipe_book`, then choose **Connect** and copy the Node.js connection string.
5. In the URI, replace the username, password, cluster host, and database name. URL-encode special characters in the database username or password.

The Atlas URI is a secret. Do not put it in React code, commit it, or share it in screenshots. The backend loads it from `backend/.env`; `backend/.gitignore` excludes that file from Git.

## Install and configure

From the repository root, install each app's dependencies:

```bash
cd backend
npm install
cd ../frontend
npm install
cd ..
```

Copy `backend/.env.example` to `backend/.env`, then set the real values locally:

```env
PORT=5000
MONGO_URI=mongodb+srv://<encoded-user>:<encoded-password>@<cluster-host>/recipe_book?retryWrites=true&w=majority
```

Keep the angle-bracket placeholders out of the real URI. The checked-in example contains no credentials.

## Run locally

Open two terminals at the repository root.

Terminal 1, start the API:

```bash
cd backend
npm run dev
```

Terminal 2, start Vite:

```bash
cd frontend
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). Vite proxies `/api` requests to `http://localhost:5000`; start the backend first and make sure it reports a successful MongoDB connection. For a production frontend bundle, run `cd frontend && npm run build`.

## API

All endpoints use JSON. Validation errors return `400` with an `error` message and field-level `details`; an invalid MongoDB id returns `400`, a valid but missing recipe returns `404`, successful creation returns `201`, and unexpected/database errors return `500` without exposing internal details.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/recipes` | List recipes, most recently updated first |
| `GET` | `/api/recipes/:id` | Read one recipe |
| `POST` | `/api/recipes` | Create a recipe |
| `PUT` | `/api/recipes/:id` | Replace editable recipe fields |
| `DELETE` | `/api/recipes/:id` | Delete a recipe |

Recipe fields are `name`, `category`, `ingredients`, `steps`, and `cookingTime`. Categories are Breakfast, Lunch, Dinner, Snack, and Dessert. Cooking time must be a positive whole number. Mongoose adds `createdAt` and `updatedAt` timestamps.

## Checks

Run the server-side input tests:

```bash
cd backend
npm test
```

Build the production frontend:

```bash
cd frontend
npm run build
```

With Atlas configured and both servers running, verify the full workflow in the browser:

- Add a recipe with multiline ingredients and steps; confirm it appears without a reload.
- Open it, inspect all detail fields, edit it, and confirm the card updates.
- Delete it and confirm the dialog requires an explicit choice.
- Refresh the page and confirm the remaining recipes still load from MongoDB.
- Try a blank name, blank ingredients/steps, and a non-positive or fractional cooking time; confirm the form identifies the problem.
- Search by a name fragment and category, then try the category filter and an unmatched search.
- Check the loading, empty collection, server error, and success message states. Resize the browser to a narrow mobile width and confirm controls remain usable.

The automated checks in this repository cover server-side field validation and the production frontend build. The browser CRUD flow requires an Atlas URI and should be completed locally using the checklist above.

## Publish to GitHub

Create an empty repository on GitHub (do not add a README if you are pushing this repository), then from the project root:

```bash
git add README.md backend frontend
git commit -m "Build recipe book CRUD app"
git remote add origin https://github.com/<your-account>/<your-repository>.git
git push -u origin main
```

If `origin` is already configured, skip `git remote add origin`. Before pushing, check `git status` and confirm `backend/.env` is not listed. Never publish Atlas credentials; rotate them immediately if they are accidentally exposed.
