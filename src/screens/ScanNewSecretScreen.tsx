import React, { useEffect, useReducer } from 'react'
import { View, StyleSheet, Button } from 'react-native'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useNavigation } from '@react-navigation/native'

import { useAuthentication } from '../context/authentication'
import { useSecrets } from '../context/secrets'
import { parse } from '../lib/qrParser'
import routes from '../lib/routeDefinitions'
import { BodyText } from '../components/typography'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})

const UI_STRINGS = {
  undetermined: 'Requesting permission to use Camera',
  denied: 'No access to camera',
  active: 'Tap to Scan Again',
}

const PERMISSION_STATES = {
  undetermined: 'undetermined',
  granted: 'granted',
  denied: 'denied',
}

const SCAN_STATES = {
  none: 'none',
  active: 'active',
}

const ACTION_TYPES = {
  SET_SCAN: 'SET_SCAN',
  SET_PERMISSION: 'SET_PERMISSION',
}

const initialState = {
  permission: PERMISSION_STATES.undetermined,
  scan: SCAN_STATES.none,
}

function scanReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_PERMISSION: {
      return { ...state, permission: action.value }
    }
    case ACTION_TYPES.SET_SCAN: {
      return { ...state, scan: action.value }
    }
    default: {
      return state
    }
  }
}

export default function ScanNewSecretScreen() {
  const [{ scan, permission }, dispatch] = useReducer(scanReducer, initialState)
  const { user } = useAuthentication()
  const { add } = useSecrets()
  const { navigate } = useNavigation()

  async function requestPermissions() {
    try {
      const permissions = await BarCodeScanner.requestPermissionsAsync()
      if (permissions) {
        const { status } = permissions
        dispatch({ type: ACTION_TYPES.SET_PERMISSION, value: status })
      }
    } catch (error) {
      dispatch({
        type: ACTION_TYPES.SET_PERMISSION,
        value: PERMISSION_STATES.undetermined,
      })
    }
  }

  async function handleBarcodeScan(barcodeScan) {
    const { data } = barcodeScan
    dispatch({ type: ACTION_TYPES.SET_SCAN, value: SCAN_STATES.active })
    try {
      const { issuer, account, secret } = await parse(data)
      await add({ uid: user.uid, secret, account, issuer })
      navigate(routes.home.name)
    } catch (error) {
      // TODO
      // Handle error UI state
      dispatch({ type: ACTION_TYPES.SET_SCAN, value: SCAN_STATES.none })
    }
  }

  useEffect(() => {
    requestPermissions()
  }, [])

  if (permission === PERMISSION_STATES.undetermined) {
    return <BodyText>{UI_STRINGS.undetermined}</BodyText>
  }

  if (permission === PERMISSION_STATES.denied) {
    return <BodyText>{UI_STRINGS.denied}</BodyText>
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={
          scan === SCAN_STATES.active ? undefined : handleBarcodeScan
        }
        style={StyleSheet.absoluteFillObject}
      />
      {scan === SCAN_STATES.active && (
        <Button
          title={UI_STRINGS.active}
          onPress={() =>
            dispatch({ type: ACTION_TYPES.SET_SCAN, value: SCAN_STATES.none })
          }
        />
      )}
    </View>
  )
}
