import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>

      <p>Capital: {country.capital}</p>

      <p>Area: {country.area}</p>

      <h3>Languages:</h3>

      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = countries.filter(country =>
    country.name.common
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div>
      <h1>Country finder</h1>

      <div>
        find countries:{' '}
        <input
          value={search}
          onChange={event => {
            setSearch(event.target.value)
            setSelectedCountry(null)
          }}
        />
      </div>

      {selectedCountry ? (
        <Country country={selectedCountry} />
      ) : countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : (
        countriesToShow.map(country => (
          <div key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => setSelectedCountry(country)}>
              show
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default App