import React, { createContext, useContext, useState } from 'react'

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

  const markInitialLoadingComplete = () => {
    setInitialLoadingComplete(true)
  }

  return (
    <InitialLoadingContext.Provider
      value={{ initialLoadingComplete, markInitialLoadingComplete }}
    >
      {children}
    </InitialLoadingContext.Provider>
  )
}
