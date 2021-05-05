import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Divider, Button, Card, Avatar } from 'react-native-paper'

import otpLib from '../../lib/otp'
import theme from '../../lib/defaultTheme'
import { Headline } from '../typography'

import Menu from './Menu'

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing(2),
  },
  cardTitle: {
    color: theme.colors.text,
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
  valueSmall: {
    fontSize: 16,
  },
})

const BUTTON_LABELS = {
  showSecret: 'SECRET',
  generateToken: 'Generate Token',
}

export default function Secret({ data, onGenerate, onDelete, onRevoke }) {
  const [showMenu, setShowMenu] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [otp, setOtp] = useState()

  useEffect(() => {
    if (!data.secret) return
    // do not fail if secret is missing

    let timeout
    const refreshOtp = () => {
      setOtp(otpLib.generate(data.secret))
      timeout = setTimeout(refreshOtp, otpLib.timeRemaining() * 1000 + 100)
    }
    refreshOtp()
    return () => clearTimeout(timeout)
  }, [data])

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

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title
          title={
            <Headline level={5} style={styles.cardTitle}>
              {data.issuer}
            </Headline>
          }
          subtitle={data.account}
          left={props => <Avatar.Icon {...props} icon="key" />}
          right={props => (
            <Menu
              open={showMenu}
              onRefresh={data.token ? handleGenerate : undefined}
              onRevoke={data.token ? handleRevoke : undefined}
              onDelete={handleDelete}
              onToggle={handleToggleMenu}
            />
          )}
        />
        <Card.Content>
          <View style={styles.row}>
            <Text style={styles.label}>OTP</Text>
            <Text style={styles.value}>{otp}</Text>
          </View>
          <Divider />
          {data.token && (
            <View style={styles.row}>
              <Text style={styles.label}>TOKEN</Text>
              <Text style={styles.value}>{data.token || '-'}</Text>
            </View>
          )}
          <Divider />
          {expanded && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>SECRET</Text>
                <Text style={[styles.value, styles.valueSmall]}>
                  {data.secret}
                </Text>
              </View>
              <Divider />
            </>
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
