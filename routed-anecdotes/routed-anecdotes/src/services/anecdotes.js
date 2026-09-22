
const baseUrl = 'http://localhost:3002/anecdotes'

const getAll = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) throw new Error('Failed to fetch anecdotes')
  return response.json()
}

const createNew = async (anecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  if (!response.ok) throw new Error('Failed to create anecdote')
  return response.json()
}

const remove = async (id) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete anecdote')
  return response.json()
}

export default { getAll, createNew, remove }