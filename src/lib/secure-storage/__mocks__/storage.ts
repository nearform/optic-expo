let store = {}

export const getItem = key => {
  return store[key]
}

export const setItem = (key, value) => {
  store[key] = value
}

export const clearAll = () => {
  store = {}
}
