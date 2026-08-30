const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)

  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 10
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      url: 'https://example.com/3',
      likes: 7
    }
  ]

  test('when list has multiple blogs, total likes is calculated correctly', () => {
    const result = listHelper.totalLikes(blogs)

    assert.strictEqual(result, 22)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      url: 'https://example.com/2',
      likes: 15
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      url: 'https://example.com/3',
      likes: 8
    }
  ]

  test('returns the blog with the most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, blogs[1])
  })
})

describe('most blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Robert',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Martin',
      url: 'https://example.com/2',
      likes: 3
    },
    {
      title: 'Blog 3',
      author: 'Robert',
      url: 'https://example.com/3',
      likes: 7
    },
    {
      title: 'Blog 4',
      author: 'Robert',
      url: 'https://example.com/4',
      likes: 4
    },
    {
      title: 'Blog 5',
      author: 'Martin',
      url: 'https://example.com/5',
      likes: 2
    }
  ]

  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert',
      blogs: 3
    })
  })
})

describe('most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Robert',
      url: 'https://example.com/1',
      likes: 5
    },
    {
      title: 'Blog 2',
      author: 'Martin',
      url: 'https://example.com/2',
      likes: 3
    },
    {
      title: 'Blog 3',
      author: 'Robert',
      url: 'https://example.com/3',
      likes: 7
    },
    {
      title: 'Blog 4',
      author: 'Robert',
      url: 'https://example.com/4',
      likes: 4
    },
    {
      title: 'Blog 5',
      author: 'Martin',
      url: 'https://example.com/5',
      likes: 2
    }
  ]

  test('returns the author with the most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert',
      likes: 16
    })
  })
})