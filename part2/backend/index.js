const express = require('express')

const app = express()

app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.json([])
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})