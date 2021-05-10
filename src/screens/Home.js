import React, { useEffect, useMemo } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSecrets } from '../context/secrets'
import { useAuthentication } from '../context/authentication'
import SecretsService from '../lib/secretsService'
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

  // TODO: probably needs a refactor, a Class here isn't much useful
  const secretsService = useMemo(() => new SecretsService(user), [user])

  useEffect(() => {
    if (!user) return

    const register = async () => {
      await secretsService.registerSubscription({
        token: expoToken,
        endpoint: 'http://dummy.com', // TODO: dummy endpoint, till backend is updated to make it optional
      })
    }

    register()
  }, [user, secretsService, expoToken])

  const handleGenerateToken = async secret => {
    try {
      const token = await secretsService.generateToken(secret)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleRevokeToken = async secret => {
    try {
      const token = await secretsService.revokeToken(secret)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteSecret = async secret => {
    try {
      await secretsService.revokeToken(secret)
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
