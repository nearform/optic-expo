import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Notification } from 'expo-notifications'

import * as storage from '../lib/secure-storage'

const defaultPendingNotifications: Notification[] = []

const initialContext = {
  pendingNotifications: defaultPendingNotifications,
  addNotification: async (_notification: Notification) => {
    // set in context provider construction
  },
  removeNotification: async (_notificationId: string) => {
    // set in context provider construction
  },
}

const PendingNotificationsContext = createContext(initialContext)

export const PendingNotificationsProvider = ({ children }) => {
  const [pendingNotifications, setPendingNotifications] = useState(
    defaultPendingNotifications
  )

  useEffect(() => {
    async function fn() {
      const s = await storage.getObject<Notification[]>('pendingNotifications')
      if (s) {
        setPendingNotifications(s)
      }
    }

    fn()
  }, [])

  const addNotification = useCallback(
    async (notification: Notification) => {
      const notificationId = notification.request.identifier
      const notAddedYet =
        pendingNotifications.findIndex(
          notification => notification.request.identifier === notificationId
        ) === -1

      if (notAddedYet) {
        const updatedPendingNotifications = [
          ...pendingNotifications,
          notification,
        ]
        setPendingNotifications(updatedPendingNotifications)
        await storage.saveObject(
          'pendingNotifications',
          updatedPendingNotifications
        )
      }
    },
    [pendingNotifications]
  )

  const removeNotification = useCallback(
    async (notificationId: string) => {
      const updatedPendingNotifications = pendingNotifications.filter(
        notification => notification.request.identifier !== notificationId
      )
      if (updatedPendingNotifications.length !== pendingNotifications.length) {
        setPendingNotifications(updatedPendingNotifications)
        await storage.saveObject(
          'pendingNotifications',
          updatedPendingNotifications
        )
      }
    },
    [pendingNotifications]
  )

  const value = useMemo(
    () => ({ pendingNotifications, addNotification, removeNotification }),
    [pendingNotifications, addNotification, removeNotification]
  )

  return (
    <PendingNotificationsContext.Provider value={value}>
      {children}
    </PendingNotificationsContext.Provider>
  )
}

export function usePendingNotifications() {
  return useContext(PendingNotificationsContext)
}
