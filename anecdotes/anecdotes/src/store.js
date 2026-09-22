import { create } from 'zustand'

const baseUrl = 'http://localhost:3001/anecdotes'
let timeoutId = null

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  notification: '',
  actions: {
    initializeAnecdotes: async () => {
      const response = await fetch(baseUrl)
      const data = await response.json()
      set({ anecdotes: data })
    },
    vote: async (id) => {
      const { anecdotes, actions } = get()
      const anecdoteToChange = anecdotes.find((a) => a.id === id)
      if (!anecdoteToChange) return

      const updatedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      }

      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAnecdote),
      })
      const saved = await response.json()

      set((s) => ({
        anecdotes: s.anecdotes.map((a) => (a.id === id ? saved : a)),
      }))

      actions.setNotification(`you voted '${saved.content}'`, 5)
    },
    createAnecdote: async (content) => {
      const { actions } = get()
      const newObject = { content, votes: 0 }

      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newObject),
      })
      const saved = await response.json()

      set((s) => ({
        anecdotes: s.anecdotes.concat(saved),
      }))

      actions.setNotification(`you created '${saved.content}'`, 5)
    },
    deleteAnecdote: async (id) => {
      const { anecdotes, actions } = get()
      const anecdoteToDelete = anecdotes.find((a) => a.id === id)

      await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      })

      set((s) => ({
        anecdotes: s.anecdotes.filter((a) => a.id !== id),
      }))

      if (anecdoteToDelete) {
        actions.setNotification(`you deleted '${anecdoteToDelete.content}'`, 5)
      }
    },
    setFilter: (filter) => set({ filter }),
    setNotification: (message, seconds = 5) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      set({ notification: message })
      timeoutId = setTimeout(() => {
        set({ notification: '' })
      }, seconds * 1000)
    },
  },
}))

// Custom Selectors
export const useAnecdotes = () =>
  useAnecdoteStore((state) => {
    const list = state.anecdotes || []
    const filter = state.filter || ''
    return [...list]
      .filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => b.votes - a.votes)
  })

export const useFilter = () => useAnecdoteStore((state) => state.filter)
export const useNotification = () => useAnecdoteStore((state) => state.notification)
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useNotificationActions = () => useAnecdoteStore((state) => state.actions)