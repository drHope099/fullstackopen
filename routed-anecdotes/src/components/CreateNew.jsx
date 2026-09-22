import { useNavigate } from 'react-router-dom'
import { useField, useAnecdotes } from '../hooks'

const CreateNew = () => {
  const { addAnecdote } = useAnecdotes()
  const navigate = useNavigate()

  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const { reset: resetContent, ...contentInput } = content
  const { reset: resetAuthor, ...authorInput } = author
  const { reset: resetInfo, ...infoInput } = info

  const handleSubmit = async (e) => {
    e.preventDefault()
    await addAnecdote({
      content: contentInput.value,
      author: authorInput.value,
      info: infoInput.value,
      votes: 0,
    })
    navigate('/')
  }

  const handleReset = () => {
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>content <input {...contentInput} /></div>
        <div>author <input {...authorInput} /></div>
        <div>url for more info <input {...infoInput} /></div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

export default CreateNew