const BlogDetail = ({ blog, handleLike, handleDelete, currentUser }) => {
  if (!blog) return null

  const onLike = () => {
    const updatedBlog = {
      user: blog.user?.id || blog.user,
      likes: (blog.likes || 0) + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }
    handleLike(blog.id || blog._id, updatedBlog)
  }

  const isCreator =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user === currentUser.id ||
      blog.user.id === currentUser.id)

  return (
    <div className="blog-detail">
      <h2>{blog.title} {blog.author}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>
        {blog.likes || 0} likes{' '}
        {currentUser && <button onClick={onLike}>like</button>}
      </div>
      <div>added by {blog.user?.name || blog.user?.username || 'unknown'}</div>
      {isCreator && (
        <button onClick={() => handleDelete(blog.id || blog._id)}>remove</button>
      )}
    </div>
  )
}

export default BlogDetail