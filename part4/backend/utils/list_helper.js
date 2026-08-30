const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite
  })
}

const mostBlogs = (blogs) => {
  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const topAuthor = Object.entries(counts).reduce((most, current) => {
    return current[1] > most[1] ? current : most
  })

  return {
    author: topAuthor[0],
    blogs: topAuthor[1]
  }
}

const mostLikes = (blogs) => {
  const likesByAuthor = {}

  blogs.forEach(blog => {
    likesByAuthor[blog.author] =
      (likesByAuthor[blog.author] || 0) + blog.likes
  })

  const topAuthor = Object.entries(likesByAuthor).reduce((most, current) => {
    return current[1] > most[1] ? current : most
  })

  return {
    author: topAuthor[0],
    likes: topAuthor[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}