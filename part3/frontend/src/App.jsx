import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  const baseUrl = '/api/persons'

  // Get all persons from the backend
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

  // Add a new person
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

  // Delete Handler
  const deletePerson = (id) => {
    const personToDelete = persons.find(p => (p.id || p._id) === id)
    
    if (window.confirm(`Delete ${personToDelete ? personToDelete.name : 'this entry'}?`)) {
      axios
        .delete(`${baseUrl}/${id}`)
        .then(() => {
          // Filter out the deleted person from local state
          setPersons(persons.filter(person => (person.id || person._id) !== id))
          setMessage(`Deleted ${personToDelete ? personToDelete.name : 'entry'}`)
          setTimeout(() => setMessage(null), 5000)
        })
        .catch(error => {
          console.log('Error deleting person:', error)
          setMessage('Information has already been removed from server')
          setTimeout(() => setMessage(null), 5000)
        })
    }
  }

  // Filter persons
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

      {personsToShow.map(person => {
        // Fallback check to support both person._id and person.id
        const personId = person.id || person._id

        return (
          <div key={personId}>
            {person.name} {person.number}{' '}

            <button onClick={() => deletePerson(personId)}>
              delete
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default App