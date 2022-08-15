import { useEffect, useRef } from 'react'
import { Animated } from 'react-native'

export function useAnimatedHeight(toggle, height) {
  const animation = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.spring(animation, {
      toValue: toggle ? 1 : 0,
      stiffness: 300,
      damping: 50,
      useNativeDriver: false,
    }).start()
  }, [animation, toggle])

  return {
    opacity: animation,
    height: Animated.multiply(animation, height),
  }
}
