const mongoose = require('mongoose')
const Blog = require('./models/blog')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const config = require('./utils/config')

const resetAndSeed = async () => {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(config.MONGODB_URI)

    console.log('Clearing database...')
    await Blog.deleteMany({})
    await User.deleteMany({})

    console.log('Creating initial user...')
    const passwordHash = await bcrypt.hash('password123', 10)
    const initialUser = new User({
      username: 'hopechacha59',
      name: 'Hope Chacha',
      passwordHash,
    })
    const savedUser = await initialUser.save()

    console.log('Creating initial blogs...')
    const initialBlogs = [
      {
        title: 'Component State and Hooks',
        author: 'Dan Abramov',
        url: 'https://react.dev',
        likes: 12,
        user: savedUser._id,
      },
      {
        title: 'Full Stack Web Development with Node and React',
        author: 'University of Helsinki',
        url: 'https://fullstackopen.com',
        likes: 25,
        user: savedUser._id,
      },
    ]

    const blogObjects = initialBlogs.map((blog) => new Blog(blog))
    const savedBlogs = await Promise.all(blogObjects.map((b) => b.save()))

    // Assign created blogs back to user record
    savedUser.blogs = savedUser.blogs.concat(savedBlogs.map((b) => b._id))
    await savedUser.save()

    console.log('Database reset and seeded successfully!')
    console.log('Test User Login Credentials -> Username: hopechacha59 | Password: password123')
  } catch (error) {
    console.error('Database reset failed:', error.message)
  } finally {
    await mongoose.connection.close()
  }
}

resetAndSeed()