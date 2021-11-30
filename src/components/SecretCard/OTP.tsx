import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'

import otpLib from '../../lib/otp'
import theme from '../../lib/theme'
import { Typography } from '../Typography'

import { CopyableInfo } from './CopyableInfo'

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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  otpData: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otp: { fontSize: 12 },
})

type OTPProps = {
  value: string
}

export const OTP: React.FC<OTPProps> = ({ value }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>OTP</Text>
      <View style={styles.otpRow}>
        <CopyableInfo typographyVariant="code">{value}</CopyableInfo>
        <CountdownCircleTimer
          key={value}
          size={30}
          strokeWidth={3}
          isPlaying
          duration={30}
          initialRemainingTime={otpLib.timeRemaining()}
          colors="#EB829C"
        >
          {({ remainingTime }) => (
            <Typography style={styles.otp} variant="code">
              {remainingTime}
            </Typography>
          )}
        </CountdownCircleTimer>
      </View>
    </View>
  )
}
