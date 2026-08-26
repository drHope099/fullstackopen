const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const mongoose = require('mongoose')
const { MONGODB_URI, PORT } = require('./utils/config')
const Person = require('./models/person')

const app = express()

// Connect to MongoDB
mongoose.set('strictQuery', false)
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// Custom Morgan token for request body
morgan.token('body', request => JSON.stringify(request.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// GET all persons
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// Info page
app.get('/info', (request, response, next) => {
  const currentTime = new Date()

  Person.countDocuments({})
    .then(count => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch(error => next(error))
})

// GET one person
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// DELETE one person
app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  console.log('DELETE ID:', id)

  Person.findByIdAndDelete(id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        return response.status(404).json({ error: 'Person not found' })
      }
      response.status(204).end()
    })
    .catch(error => next(error))
})

// POST new person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// Express 5 single-page application fallback route
app.get('/*path', (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})