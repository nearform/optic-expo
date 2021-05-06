import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

import otpLib from '../../lib/otp'
import theme from '../../lib/defaultTheme'

const styles = StyleSheet.create({
  row: {
    flex: 1,
    marginTop: theme.spacing(2),
    paddingHorizontal: theme.spacing(1),
  },
  label: {
    color: theme.colors.textSecondary,
    marginRight: theme.spacing(1),
    fontSize: 10,
  },
  value: {
    fontFamily: 'monospace',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing(2),
  },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  otp: { fontSize: 12 },
})

export default function OTP({ value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>OTP</Text>
      <View style={styles.otpRow}>
        <Text style={styles.value}>{value}</Text>
        <CountdownCircleTimer
          key={value}
          size={30}
          strokeWidth={3}
          isPlaying
          duration={otpLib.timeRemaining()}
          colors="#EB829C"
        >
          {({ remainingTime }) => (
            <Text style={styles.otp}>{remainingTime}</Text>
          )}
        </CountdownCircleTimer>
      </View>
    </View>
  )
}
