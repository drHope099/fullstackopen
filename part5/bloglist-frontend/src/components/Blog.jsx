import { useState } from 'react'

const Blog = ({ blog, updateLikes, deleteBlog, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const removeButtonStyle = {
    backgroundColor: '#5594f2',
    color: 'white',
    border: 'none',
    borderRadius: 3,
    padding: '2px 6px',
    cursor: 'pointer',
    marginTop: 4,
  }

  const handleLike = () => {
    const userId = blog.user ? (blog.user.id || blog.user) : null
    const updatedBlog = {
      user: userId,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    updateLikes(blog.id, updatedBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  // Check whether current user created this blog post
  const showDeleteButton =
    !blog.user ||
    (blog.user.username && currentUser?.username && blog.user.username === currentUser.username) ||
    (blog.user.id && currentUser?.id && blog.user.id === currentUser.id) ||
    (typeof blog.user === 'string' && blog.user === currentUser?.id)

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes || 0}{' '}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name || blog.user?.username || ''}</div>
          {showDeleteButton && (
            <div>
              <button onClick={handleDelete} style={removeButtonStyle}>
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog