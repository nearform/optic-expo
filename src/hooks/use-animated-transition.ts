import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useEffect } from 'react'

export default function useAnimatedTransition(active: boolean, height: number) {
  const sharedValue = useSharedValue(0)
  useEffect(() => {
    sharedValue.value = active ? 1 : 0
  }, [active, sharedValue])
  const transition = useDerivedValue(() =>
    withSpring(sharedValue.value, { stiffness: 300, damping: 50 })
  )
  return useAnimatedStyle(() => {
    return {
      overflow: 'hidden',
      opacity: transition.value,
      height: transition.value * height,
    }
  })
}
