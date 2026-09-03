import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import '@testing-library/jest-dom' // <-- ADD THIS IMPORT

describe('<Blog />', () => {
  const blog = {
    title: 'Testing React Components with Vitest',
    author: 'Hope Chacha',
    url: 'https://fullstackopen.com',
    likes: 42,
    user: {
      name: 'Hope Chacha',
      username: 'hopechacha59'
    }
  }

  test('renders title and author, but not url or likes by default', () => {
    render(<Blog blog={blog} />)

    expect(screen.getByText(/Testing React Components with Vitest/)).toBeDefined()
    expect(screen.getByText(/Hope Chacha/)).toBeDefined()

    const urlElement = screen.queryByText('https://fullstackopen.com')
    const likesElement = screen.queryByText('likes 42')

    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })

  test('renders url and likes when the view button is clicked', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('https://fullstackopen.com')).toBeInTheDocument()
    expect(screen.getByText(/likes 42/)).toBeInTheDocument()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const mockHandler = vi.fn()
    const user = userEvent.setup()

    render(<Blog blog={blog} updateLikes={mockHandler} />)

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})