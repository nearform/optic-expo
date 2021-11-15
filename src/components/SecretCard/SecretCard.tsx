import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Card, Divider } from 'react-native-paper'
import Animated from 'react-native-reanimated'

import otpLib from '../../lib/otp'
import theme from '../../lib/theme'
import { Secret } from '../../types'
import { Typography } from '../Typography'
import useAnimatedTransition from '../../hooks/use-animated-transition'

import { ContextMenu } from './ContextMenu'
import { OTP } from './OTP'
import { CopyableInfo } from './CopyableInfo'

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
    fontFamily: 'monospace',
    fontSize: 24,
    color: theme.colors.text,
    marginBottom: theme.spacing(2),
  },
  valueSmall: { fontSize: 16 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  otp: { fontSize: 12 },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

const BUTTON_LABELS = {
  showSecret: 'SECRET',
  generateToken: 'Generate Token',
}

type SecretProps = {
  data: Secret
  onGenerate: (_: Secret) => void
  onDelete: (_: Secret) => void
  onRevoke: (_: Secret) => void
}

export const SecretCard: React.FC<SecretProps> = ({
  data,
  onGenerate,
  onDelete,
  onRevoke,
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [otp, setOtp] = useState('')

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

  const handleGenerate = () => {
    onGenerate(data)
    setGenerating(true)
    setShowMenu(false)
  }

  useEffect(() => {
    setGenerating(false)
  }, [data.token])

  const handleDelete = () => {
    onDelete(data)
    setShowMenu(false)
  }

  const handleRevoke = () => {
    onRevoke(data)
    setShowMenu(false)
  }

  const handleToggleExpand = () => setExpanded(!expanded)
  const handleToggleMenu = () => setShowMenu(!showMenu)

  const secretAnimationStyle = useAnimatedTransition(expanded, 64)

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
              onRefresh={data.token ? handleGenerate : undefined}
              onRevoke={data.token ? handleRevoke : undefined}
              onDelete={handleDelete}
              onToggle={handleToggleMenu}
            />
          )}
        />
        <Card.Content style={styles.cardContent}>
          <OTP value={otp} />
          <Divider />
          {data.token && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>TOKEN</Text>
                <CopyableInfo textStyle={styles.value}>
                  {data.token || '-'}
                </CopyableInfo>
              </View>
              <Divider />
            </>
          )}
          <Animated.View style={secretAnimationStyle}>
            <View style={styles.row}>
              <Text style={styles.label}>SECRET</Text>
              <Text style={[styles.value, styles.valueSmall]}>
                {data.secret}
              </Text>
            </View>
            <Divider />
          </Animated.View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <View style={styles.leftActions}>
            <Button
              compact
              onPress={handleToggleExpand}
              icon={expanded ? 'eye-off' : 'eye'}
            >
              {BUTTON_LABELS.showSecret}
            </Button>
          </View>
          <View style={styles.rightActions}>
            {!data.token && (
              <Button
                onPress={handleGenerate}
                mode="contained"
                icon="plus"
                loading={generating}
                disabled={generating}
              >
                {BUTTON_LABELS.generateToken}
              </Button>
            )}
          </View>
        </Card.Actions>
      </Card>
    </View>
  )
}
