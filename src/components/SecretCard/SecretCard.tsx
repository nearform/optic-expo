import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Divider, Button, Card, Avatar } from 'react-native-paper'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

import otpLib from '../../lib/otp'
import theme from '../../lib/theme'
import { Secret } from '../../types'
import { Typography } from '../Typography'

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

function useTransition(active: boolean) {
  const opacity = useSharedValue(0)
  useEffect(() => {
    opacity.value = active ? 1 : 0
  }, [active, opacity])
  const opacityTransition = useDerivedValue(() => withSpring(opacity.value))
  return useAnimatedStyle(() => {
    return {
      opacity: opacityTransition.value,
      transform: [{ scaleY: opacityTransition.value }],
    }
  })
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

  const secretStyle = useTransition(expanded)

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
          {expanded && (
            <Animated.View style={secretStyle}>
              <View style={styles.row}>
                <Text style={styles.label}>SECRET</Text>
                <Text style={[styles.value, styles.valueSmall]}>
                  {data.secret}
                </Text>
              </View>
              <Divider />
            </Animated.View>
          )}
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
