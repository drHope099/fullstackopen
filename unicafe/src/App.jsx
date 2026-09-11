import { useSelector, useDispatch } from 'react-redux'

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

const Statistics = ({ good, ok, bad }) => {
  const total = good + ok + bad
  const average = total === 0 ? 0 : (good - bad) / total
  const positive = total === 0 ? 0 : (good / total) * 100

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={ok} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positive} %`} />
      </tbody>
    </table>
  )
}

const App = () => {
  const dispatch = useDispatch()

  // Extract individual slices to avoid selector warnings
  const good = useSelector(state => state.good)
  const ok = useSelector(state => state.ok)
  const bad = useSelector(state => state.bad)

  return (
    <div>
      <h1>Unicafe</h1>
      <h2>give feedback</h2>
      <button onClick={() => dispatch({ type: 'GOOD' })}>good</button>
      <button onClick={() => dispatch({ type: 'OK' })}>neutral</button>
      <button onClick={() => dispatch({ type: 'BAD' })}>bad</button>
      <button onClick={() => dispatch({ type: 'ZERO' })}>reset stats</button>

      <h2>statistics</h2>
      <Statistics good={good} ok={ok} bad={bad} />
    </div>
  )
}

export default App