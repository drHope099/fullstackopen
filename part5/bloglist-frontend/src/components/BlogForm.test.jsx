import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import '@testing-library/jest-dom' // <-- ADD THIS IMPORT

test('<BlogForm /> calls the event handler it received as props with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  // Target inputs by DOM role instead of placeholder
  const inputs = screen.getAllByRole('textbox')
  const createButton = screen.getByText('create')

  // inputs[0] is title, inputs[1] is author, inputs[2] is url
  await user.type(inputs[0], 'Testing react components')
  await user.type(inputs[1], 'Hope Chacha')
  await user.type(inputs[2], 'https://fullstackopen.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing react components',
    author: 'Hope Chacha',
    url: 'https://fullstackopen.com'
  })
})