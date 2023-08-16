import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react'

const initialContext = {
  initialLoadingComplete: false,
  markInitialLoadingComplete: () => {
    // set in context provider construction
  },
}

const InitialLoadingContext = createContext(initialContext)

export const useInitialLoading = () => useContext(InitialLoadingContext)

export const InitialLoadingProvider = ({ children }) => {
  const [initialLoadingComplete, setInitialLoadingComplete] = useState(false)

  const markInitialLoadingComplete = useCallback(() => {
    setInitialLoadingComplete(true)
  }, [setInitialLoadingComplete])

  const value = useMemo(
    () => ({
      initialLoadingComplete,
      markInitialLoadingComplete,
    }),
    [initialLoadingComplete, markInitialLoadingComplete]
  )

  return (
    <InitialLoadingContext.Provider value={value}>
      {children}
    </InitialLoadingContext.Provider>
  )
}
