const Notification = ({ notification }) => {
  if (!notification || !notification.message) return null

  const notificationStyle = {
    color: notification.type === 'error' ? 'red' : 'green',
    background: 'lightgrey',
    border: '1px solid',
    borderColor: notification.type === 'error' ? 'red' : 'green',
    padding: '10px',
    margin: '10px 0',
  }

  return <div style={notificationStyle}>{notification.message}</div>
}

export default Notification