import { useContext } from 'react'
import { NotificationContext } from '../contexts/NotificationContext'

export const useNotify = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotify must be used within a NotificationContextProvider')
  }
  return context.notify
}

export const useNotificationValue = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotificationValue must be used within a NotificationContextProvider')
  }
  return context.notification
}