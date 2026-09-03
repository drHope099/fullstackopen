const Notification = ({ message, type }) => {
  if (!message) return null

  const notificationStyle = {
    color: type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    border: '1px solid',
    borderColor: type === 'error' ? 'red' : 'green',
    padding: '10px',
    margin: '10px 0',
  }

  return (
    <div className={type === 'error' ? 'error' : 'success'} style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification