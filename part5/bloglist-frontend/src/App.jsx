import { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, useNavigate, useMatch, Navigate } from 'react-router-dom'
import BlogForm from './components/BlogForm'
import LoginForm from './components/loginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogList from './components/Bloglist'
import BlogDetail from './components/BlogDetail'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })
  const navigate = useNavigate()
  const blogFormRef = useRef(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notify(`Welcome ${user.name || user.username}`)
      navigate('/')
    } catch (exception) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current?.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat({ ...returnedBlog, user: user }))
      notify(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
    } catch (exception) {
      console.error('Create error:', exception.response?.data || exception.message)
      notify('failed to create blog', 'error')
    }
  }

  const handleLike = async (id, blogObject) => {
    try {
      const returnedBlog = await blogService.update(id, blogObject)
      setBlogs(
        blogs.map((b) => {
          const currentId = b.id || b._id
          return currentId === id
            ? { ...returnedBlog, user: b.user || returnedBlog.user }
            : b
        })
      )
    } catch (exception) {
      notify('error updating likes', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((b) => (b.id || b._id) !== id))
      notify('blog post deleted successfully')
      navigate('/')
    } catch (exception) {
      console.error('Delete error details:', exception.response?.data || exception.message)
      notify('failed to delete blog post', 'error')
    }
  }

  //Extract parameterized blog id from /blogs/:id route
  const match = useMatch('/blogs/:id')
  const matchedBlog = match
   ? blogs.find((b) => (b.id || b._id) === match.params.id)
    : null

    const navStyle = {
    padding: 10,
    backgroundColor: '#f4f4f4',
    marginBottom: 15,
    borderBottom: '1px solid #ccc',
  }

  const padding = {
    padding: 5,
  }

 return (
    <div>
      <nav style={navStyle}>
        <Link style={padding} to="/">blogs</Link>
        {user ? (
          <span>
            <Link style={padding} to="/create">create new</Link>
            <em>{user.name || user.username} logged in</em>{' '}
            <button onClick={handleLogout}>logout</button>
          </span>
        ) : (
          <Link style={padding} to="/login">login</Link>
        )}
      </nav>

      <h2>blog app</h2>
      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate replace to="/" />
            ) : (
              <LoginForm
                handleLogin={handleLogin}
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
              />
            )
          }
        />
        <Route
          path="/create"
          element={
            user ? (
              <BlogForm createBlog={addBlog} />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogDetail
              blog={matchedBlog}
              handleLike={handleLike}
              handleDelete={handleDelete}
              currentUser={user}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App