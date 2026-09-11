import { createContext, useState, useRef } from 'react'

export const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState(null)
  const timerRef = useRef(null)

  const notify = (message, seconds = 5) => {
    setNotification(message)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      setNotification(null)
    }, seconds * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}