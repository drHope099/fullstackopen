import { useState, useEffect, createContext, useContext } from 'react'
import anecdoteService from '../services/anecdotes'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => setValue(event.target.value)
  const reset = () => setValue('')

  return { type, value, onChange, reset }
}

const AnecdoteContext = createContext()

export const AnecdoteProvider = ({ children }) => {
  const [anecdotes, setAnecdotes] = useState([])

  useEffect(() => {
    anecdoteService.getAll().then((data) => setAnecdotes(data))
  }, [])

  const addAnecdote = async (anecdote) => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    setAnecdotes((prev) => prev.concat(newAnecdote))
  }

  const deleteAnecdote = async (id) => {
    await anecdoteService.remove(id)
    setAnecdotes((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <AnecdoteContext.Provider value={{ anecdotes, addAnecdote, deleteAnecdote }}>
      {children}
    </AnecdoteContext.Provider>
  )
}

export const useAnecdotes = () => {
  const context = useContext(AnecdoteContext)
  if (!context) {
    throw new Error('useAnecdotes must be used within an AnecdoteProvider')
  }
  return context
}