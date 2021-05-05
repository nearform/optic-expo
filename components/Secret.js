import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button, Card, Avatar, IconButton } from 'react-native-paper'

import theme from '../lib/defaultTheme'

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing(2),
    borderColor: 'black',
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
    flexDirection: 'row',
    marginBottom: theme.spacing(1),
    alignItems: 'center',
  },
  label: {
    color: '#999999',
    marginRight: theme.spacing(1),
  },
  value: {
    fontFamily: 'monospace',
  },
})

const UI_STRINGS = {
  generateTokenButtonLabel: 'Generate',
  renewTokenButtonLabel: 'Renew',
  revokeTokenButtonLabel: 'Revoke',
  deleteButtonLabel: 'Delete',
}

export default function Secret({ data, onGenerate, onDelete, onRevoke }) {
  const [expanded, setExpanded] = useState(false)

  const handleGenerate = () => onGenerate(data)
  const handleDelete = () => onDelete(data)
  const handleRevoke = () => onRevoke(data)
  const handleToggleExpand = () => setExpanded(!expanded)

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title
          title={data.issuer}
          subtitle={data.account}
          left={props => <Avatar.Icon {...props} icon="key" />}
          right={props => (
            <IconButton
              icon={`chevron-${expanded ? 'up' : 'down'}`}
              accessibilityLabel="toggle-card"
              size={20}
              mode="contained"
              onPress={handleToggleExpand}
            />
          )}
        />
        {expanded && (
          <>
            <Card.Content>
              <View style={styles.row}>
                <Text style={styles.label}>Secret:</Text>
                <Text style={styles.value}>{data.secret}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Token:</Text>
                <Text style={styles.value}>{data.token || '-'}</Text>
              </View>
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <View style={styles.leftActions}>
                <Button onPress={handleGenerate}>
                  {data.token
                    ? UI_STRINGS.renewTokenButtonLabel
                    : UI_STRINGS.generateTokenButtonLabel}
                </Button>
                <Button onPress={handleRevoke}>
                  {UI_STRINGS.revokeTokenButtonLabel}
                </Button>
              </View>
              <View style={styles.rightActions}>
                <Button onPress={handleDelete}>
                  {UI_STRINGS.deleteButtonLabel}
                </Button>
              </View>
            </Card.Actions>
          </>
        )}
      </Card>
    </View>
  )
}
