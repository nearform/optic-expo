import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { dismissNotificationAsync } from 'expo-notifications'

import * as storage from '../lib/secure-storage'
import { type OpticNotification } from '../types'

const defaultPendingNotifications: OpticNotification[] = []

const initialContext = {
  pendingNotifications: defaultPendingNotifications,
  addNotification: async (_notification: OpticNotification) => {
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
      const s = await storage.getObject<OpticNotification[]>(
        'pendingNotifications'
      )
      if (s) {
        setPendingNotifications(s)
      }
    }

    fn()
  }, [setPendingNotifications])

  const addNotification = useCallback(
    async (notification: OpticNotification) => {
      const notificationId = notification.request.content.data.uniqueId
      const notAddedYet =
        pendingNotifications.findIndex(
          notification =>
            notification.request.content.data.uniqueId === notificationId
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
    [pendingNotifications, setPendingNotifications]
  )

  const removeNotification = useCallback(
    async (notificationId: string) => {
      const updatedPendingNotifications = pendingNotifications.filter(
        notification =>
          notification.request.content.data.uniqueId !== notificationId
      )
      if (updatedPendingNotifications.length !== pendingNotifications.length) {
        setPendingNotifications(updatedPendingNotifications)
        await storage.saveObject(
          'pendingNotifications',
          updatedPendingNotifications
        )

        // We use uniqueId to identify our OTP requests, but we use a different
        // identifier for their associated push notifications.
        const removedNotification = pendingNotifications.find(
          notification =>
            notification.request.content.data.uniqueId === notificationId
        )
        try {
          await dismissNotificationAsync(removedNotification.request.identifier)
        } catch (e) {
          console.warn(`Failed to dismiss push notification: ${e.message}`)
        }
      }
    },
    [pendingNotifications, setPendingNotifications]
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
