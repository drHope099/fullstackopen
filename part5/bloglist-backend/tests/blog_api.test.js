const { test, after, before } = require('node:test')
const supertest = require('supertest')
const mongoose = require('mongoose')
const config = require('../utils/config')
const app = require('../app')
const Blog = require('../models/blog')
const { strictEqual } = require('node:assert')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'John Doe',
    url: 'https://example.com/html-is-easy',
    likes: 10
  },
  {
    title: 'CSS Tricks',
    author: 'Jane Smith',
    url: 'https://example.com/css-tricks',
    likes: 15
  }
]

before(async () => {
  await mongoose.connect(config.MONGODB_URI)

  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  strictEqual(response.body.length, initialBlogs.length)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'Alice Johnson',
    url: 'https://example.com/new-blog-post',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  strictEqual(response.body.length, initialBlogs.length + 1)
})

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: 'Testing without likes',
    author: 'Hope',
    url: 'http://example.com/no-likes'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  strictEqual(response.body.likes, 0)
})

test('a blog without title is not added', async () => {
  const blogsAtStart = await Blog.find({})

  const newBlog = {
    author: 'Hope',
    url: 'http://example.com/no-title',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await Blog.find({})

  strictEqual(blogsAtEnd.length, blogsAtStart.length)
})

test('a blog can be updated', async () => {
  const blogsAtStart = await Blog.find({})
  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    title: 'Updated Blog Title',
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 10
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAtEnd = await Blog.find({})
  const updated = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)

  strictEqual(updated.title, updatedBlog.title)
  strictEqual(updated.likes, updatedBlog.likes)
})

after(async () => {
  await mongoose.connection.close()
})