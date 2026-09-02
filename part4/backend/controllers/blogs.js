const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

// GET all blogs with populated user information
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (exception) {
    next(exception)
  }
})

// POST a new blog
blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
      ...request.body,
      user: user._id
    })

    const savedBlog = await blog.save()

    // Link blog to user's record
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    // Return newly created blog populated with user details
    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
    response.status(201).json(populatedBlog)

  } catch (exception) {
    next(exception)
  }
})

// DELETE a blog
blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }

    // Safely extract the blog's user ID whether blog.user is populated or unpopulated
    const blogUserId = blog.user && blog.user._id
      ? blog.user._id.toString()
      : blog.user ? blog.user.toString() : null

    // Safely extract the current request user's ID
    const currentUserId = user._id
      ? user._id.toString()
      : user.id ? user.id.toString() : null

    if (blogUserId !== currentUserId) {
      return response.status(401).json({ error: 'only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

// UPDATE blog
blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes, user } = request.body

  const blog = {
    title,
    author,
    url,
    likes,
    user: typeof user === 'object' ? user.id || user._id : user
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter