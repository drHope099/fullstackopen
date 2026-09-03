const express = require('express')
const app = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

// Global Middleware
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

// Standard Routes
app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

// Testing Reset Route (Only active in test mode)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

// Error Handling Middleware (MUST be loaded last)
app.use(middleware.errorHandler)

module.exports = app