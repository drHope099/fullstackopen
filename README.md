# Full Stack Open — Phonebook

This project is part of the [Full Stack Open](https://fullstackopen.com/) course.

## Phonebook

A full-stack phonebook application built with React and Node.js/Express.

### Features

- View all phonebook contacts
- Add new contacts
- Delete contacts
- Filter contacts by name
- REST API for phonebook data
- React frontend served by the Express backend
- Backend deployed to Render

## Technologies

- React
- Vite
- JavaScript
- Axios
- Node.js
- Express
- Morgan
- CORS
- Render

## Online Application

[Open the Phonebook application](PASTE-YOUR-RENDER-URL-HERE)

## Backend API

The phonebook API is available at:

`PASTE-YOUR-RENDER-URL-HERE/api/persons`

## Local Development

### Backend

```bash
cd part3/backend
npm install
npm run dev
```

The backend runs locally at:

`http://localhost:3001`

### Frontend

```bash
cd part3/frontend
npm install
npm run dev
```

The frontend runs locally in development mode using Vite.

### Production Build

To create the frontend production build:

```bash
npm run build
```

The generated `dist` directory is served by the Express backend.

## Full Stack Open Exercises

This project covers exercises **3.1–3.11** of Part 3, including:

- Phonebook REST API
- HTTP requests
- Express backend
- Middleware
- Morgan logging
- CORS
- Connecting React frontend to the backend
- Deploying the backend
- Serving the React production build from the backend
