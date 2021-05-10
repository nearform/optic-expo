import React, { useEffect, useMemo } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSecrets } from '../context/secrets'
import { useAuthentication } from '../context/authentication'
import apiFactory from '../lib/api'
import routes from '../lib/routeDefinitions'
import EmptyTokensText from '../components/EmptyTokensText'
import Actions from '../components/Actions'
import Secret from '../components/Secret'
import usePushToken from '../hooks/use-push-token'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
})

export default function Home() {
  const { user } = useAuthentication()
  const { navigate } = useNavigation()
  const { secrets, update, remove } = useSecrets()
  const expoToken = usePushToken()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  useEffect(() => {
    if (!user || !expoToken) return

    const register = async () => {
      await api.registerSubscription({
        type: 'expo',
        token: expoToken,
        endpoint: 'http://dummy.com', // TODO: dummy endpoint, till backend is updated to make it optional
      })
    }

    register()
  }, [user, api, expoToken])

  const handleGenerateToken = async secret => {
    try {
      const token = await api.generateToken(secret)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleRevokeToken = async secret => {
    try {
      const token = await api.revokeToken(secret)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteSecret = async secret => {
    try {
      await api.revokeToken(secret)
      await remove(secret)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {secrets.length === 0 ? (
        <EmptyTokensText />
      ) : (
        secrets.map(secret => (
          <Secret
            key={secret._id}
            data={secret}
            onGenerate={handleGenerateToken}
            onRevoke={handleRevokeToken}
            onDelete={handleDeleteSecret}
          />
        ))
      )}

      <Actions
        onScan={() => navigate(routes.scan.name)}
        onUpload={() => navigate(routes.upload.name)}
        onType={() => navigate(routes.type.name)}
      />
    </ScrollView>
  )
}
