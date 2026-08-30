const app = require('./app')
const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error)
  })

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})