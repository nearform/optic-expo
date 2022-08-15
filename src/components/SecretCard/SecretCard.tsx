import React, { useEffect, useMemo, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Divider,
} from 'react-native-paper'

import { useAnimatedHeight } from '../../hooks/use-animated-height'
import otpLib from '../../lib/otp'
import theme from '../../lib/theme'
import { Secret } from '../../types'
import { Typography } from '../Typography'

import { ContextMenu } from './ContextMenu'
import { OTP } from './OTP'
import { TokensInfo } from './TokensInfo'

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing(2),
  },
  cardContent: {
    paddingHorizontal: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  rightActions: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  leftActions: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
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
    marginBottom: theme.spacing(2),
  },
  valueSmall: { fontSize: 16 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  otp: { fontSize: 12 },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteLabel: {
    color: theme.colors.error,
    fontSize: 16,
    marginLeft: theme.spacing(1),
  },
  deleteActivity: {
    marginRight: theme.spacing(2),
  },
})

const BUTTON_LABELS = {
  showSecret: 'SECRET',
  addToken: 'Add Token',
}

type SecretProps = {
  data: Secret
  onAddToken: () => void
  onViewTokens: () => void
  onDelete: (_: Secret) => Promise<boolean>
}

export const SecretCard: React.FC<SecretProps> = ({
  data,
  onAddToken,
  onViewTokens,
  onDelete,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [deleteInProgress, setDeleteInProgress] = useState(false)
  const [otp, setOtp] = useState('')
  const tokens = useMemo(() => (data.tokens ? data.tokens : []), [data])
  const secretStyle = useAnimatedHeight(expanded, 68)

  useEffect(() => {
    if (!data.secret) return
    // do not fail if secret is missing

    let timeout: NodeJS.Timeout

    const refreshOtp = () => {
      setOtp(otpLib.generate(data.secret))
      timeout = setTimeout(refreshOtp, otpLib.timeRemaining() * 1000 + 100)
    }
    refreshOtp()
    return () => clearTimeout(timeout)
  }, [data.secret])

  const handleDelete = async () => {
    setDeleteInProgress(true)
    const deleteSuccessful = await onDelete(data)
    setDeleteInProgress(deleteSuccessful)
    setShowMenu(false)
  }

  const handleToggleExpand = () => setExpanded(!expanded)
  const handleToggleMenu = () => setShowMenu(!showMenu)

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title
          title={<Typography variant="h5">{data.issuer}</Typography>}
          subtitle={data.account}
          left={props => <Avatar.Icon {...props} icon="key" />}
          right={() => (
            <ContextMenu
              open={showMenu}
              onDelete={handleDelete}
              onToggle={handleToggleMenu}
            />
          )}
        />
        <Card.Content style={styles.cardContent}>
          <OTP value={otp} />
          <Divider />
          <TokensInfo count={tokens.length} onPress={onViewTokens} />
          <Animated.View style={[secretStyle, { overflow: 'hidden' }]}>
            <View style={styles.row}>
              <Text style={styles.label}>SECRET</Text>
              <Typography
                variant="code"
                style={[styles.value, styles.valueSmall]}
              >
                {data.secret}
              </Typography>
            </View>
            <Divider />
          </Animated.View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <View style={styles.leftActions}>
            {deleteInProgress ? (
              <Text style={styles.deleteLabel}>Deleting secret...</Text>
            ) : (
              <Button
                compact
                onPress={handleToggleExpand}
                icon={expanded ? 'eye-off' : 'eye'}
              >
                {BUTTON_LABELS.showSecret}
              </Button>
            )}
          </View>
          <View style={styles.rightActions}>
            {deleteInProgress ? (
              <ActivityIndicator
                style={styles.deleteActivity}
                color={theme.colors.error}
              />
            ) : (
              <Button onPress={onAddToken} mode="contained" icon="plus">
                {BUTTON_LABELS.addToken}
              </Button>
            )}
          </View>
        </Card.Actions>
      </Card>
    </View>
  )
}
