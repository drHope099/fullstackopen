const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

const User = require('../models/user')
const { tokenExtractor } = require('../utils/middleware')

// GET all blogs
blogsRouter.get('/', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs)
    })
})

// POST a new blog
blogsRouter.post('/', tokenExtractor, async (request, response) => {
  try {
    // Check that a token was provided
    if (!request.token) {
      return response.status(401).json({
        error: 'token missing'
      })
    }

    // Verify the token
    const decodedToken = jwt.verify(
      request.token,
      process.env.SECRET
    )

    // Find the user identified by the token
    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({
        error: 'user not found'
      })
    }

    // Create the blog and assign the logged-in user
    const blog = new Blog({
      ...request.body,
      user: user._id
    })

    // Save the blog
    const savedBlog = await blog.save()

    // Add blog ID to user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    response.status(201).json(savedBlog)

  } catch (error) {
    response.status(401).json({
      error: error.message
    })
  }
})

// DELETE a blog
blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    // Verify if the user trying to delete is the creator of the blog
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

  } catch (error) {
    response.status(400).json({
      error: error.message
    })
  }
})

// UPDATE blog
blogsRouter.put('/:id', (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true }
  )
    .then(result => {
      response.json(result)
    })
    .catch(error => {
      response.status(400).json({
        error: error.message
      })
    })
})

module.exports = blogsRouter