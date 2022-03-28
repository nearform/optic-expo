import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import * as storage from '../lib/secure-storage'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PendingNotification {}

const defaultPendingNotifications: PendingNotification[] = []

const initialContext = {
  pendingNotifications: defaultPendingNotifications,
}

const PendingNotificationsContext = createContext(initialContext)

export const PendingNotificationsProvider = ({ children }) => {
  const [pendingNotifications, setPendingNotifications] = useState(
    defaultPendingNotifications
  )

  useEffect(() => {
    async function fn() {
      const s = await storage.getObject<PendingNotification[]>(
        'pendingNotifications'
      )
      if (s) {
        setPendingNotifications(s)
      }
    }

    fn()
  }, [])

  const value = useMemo(
    () => ({ pendingNotifications }),
    [pendingNotifications]
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
