import { StyleSheet, View, Text } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import React, { useCallback, useMemo } from 'react'
import { Avatar, Button, Card } from 'react-native-paper'

import theme from '../lib/theme'
import { MainStackParamList } from '../Main'
import { useAuth } from '../context/AuthContext'
import apiFactory from '../lib/api'
import { Typography } from '../components/Typography'

const styles = StyleSheet.create({
  screen: {
    margin: theme.spacing(2),
  },
  cardContent: {
    paddingHorizontal: theme.spacing(1),
  },
  cardActions: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  form: {
    padding: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
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
})

type Props = NativeStackScreenProps<MainStackParamList, 'OtpRequest'>

export const OtpRequestScreen = ({ route, navigation }: Props) => {
  const { navigate } = navigation
  const { user } = useAuth()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])
  const { token, secret, uniqueId } = route.params
  const note = secret.tokens.find(item => item.token === token)?.note

  const handleRejectToken = useCallback(async () => {
    console.log('Reject')
    api.respond(secret.secret, uniqueId, false)
    navigate('Home')
    // TODO show notification
  }, [api, navigate, secret.secret, uniqueId])

  const handleApproveToken = useCallback(async () => {
    api.respond(secret.secret, uniqueId, true)
    navigate('Home')
    // TODO show notification
  }, [api, navigate, secret.secret, uniqueId])

  return (
    <View style={styles.screen}>
      <Card>
        <Card.Title
          title={<Typography variant="h5">{secret.issuer}</Typography>}
          subtitle={secret.account}
          left={props => <Avatar.Icon {...props} icon="key" />}
        />
        <Card.Content style={styles.cardContent}>
          <View>
            <View>
              <Text>Token</Text>
            </View>
            <View>
              <Text>{token}</Text>
            </View>
          </View>
          <View>
            <View>
              <Text>Description</Text>
            </View>
            <View>
              <Text>{note}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button
            style={styles.button}
            mode="outlined"
            onPress={handleRejectToken}
          >
            Reject
          </Button>
          <Button
            style={styles.button}
            mode="contained"
            onPress={handleApproveToken}
          >
            Approve
          </Button>
        </Card.Actions>
      </Card>
    </View>
  )
}
