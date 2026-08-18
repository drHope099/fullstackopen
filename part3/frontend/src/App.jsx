import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  // The backend and frontend are now served from the same address
  const baseUrl = '/api/persons'

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    axios
      .post(baseUrl, personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')

        setMessage(`Added ${newName}`)

        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
      })
  }

  const deletePerson = id => {
    const person = persons.find(person => person.id === id)

    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    axios
      .delete(`${baseUrl}/${id}`)
      .then(() => {
        setPersons(
          persons.filter(person => person.id !== id)
        )
      })
      .catch(error => {
        console.log(error)
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <div>
        filter shown with:{' '}
        <input
          value={filter}
          onChange={event => setFilter(event.target.value)}
        />
      </div>

      <h2>add a new</h2>

      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input
            value={newName}
            onChange={event => setNewName(event.target.value)}
          />
        </div>

        <div>
          number:{' '}
          <input
            value={newNumber}
            onChange={event => setNewNumber(event.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>

      {message && (
        <div>
          {message}
        </div>
      )}

      <h2>Numbers</h2>

      {personsToShow.map(person => (
        <div key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => deletePerson(person.id)}>
            delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default App