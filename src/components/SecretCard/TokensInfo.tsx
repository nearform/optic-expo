import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Divider } from 'react-native-paper'

import theme from '../../lib/theme'
import { Typography } from '../Typography'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingVertical: theme.spacing(2),
  },
  tokensCountLabel: {
    color: theme.colors.textSecondary,
    marginRight: theme.spacing(1),
    paddingBottom: theme.spacing(0.5),
    fontSize: 10,
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
})

type Props = {
  count: number
  onPress: () => void
}

export const TokensInfo = ({ count, onPress }: Props) => {
  return (
    <>
      <View style={styles.container}>
        <View>
          <Typography style={styles.tokensCountLabel} variant="overline">
            TOKENS
          </Typography>
          <Typography variant="code">{count}</Typography>
        </View>
        <View>
          <Button
            onPress={onPress}
            contentStyle={{ flexDirection: 'row-reverse' }}
            labelStyle={{ textDecorationLine: 'underline' }}
            uppercase={false}
          >
            See tokens
          </Button>
        </View>
      </View>
      <Divider style={styles.divider} />
    </>
  )
}
