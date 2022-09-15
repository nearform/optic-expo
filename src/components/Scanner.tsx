import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, ViewStyle } from 'react-native'
import { Camera } from 'expo-camera'
import { BarCodeScanner } from 'expo-barcode-scanner'

import theme from '../lib/theme'

const edge: ViewStyle = {
  borderColor: 'white',
  borderLeftWidth: 6,
  borderTopWidth: 6,
  borderTopLeftRadius: 2,
  position: 'absolute',
  height: theme.spacing(5),
  width: theme.spacing(5),
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBox: {
    height: 300,
    width: 300,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRight: {
    transform: [{ rotate: '180deg' }],
    ...edge,
    right: 0,
    bottom: 0,
  },
  bottomLeft: {
    transform: [{ rotateX: '180deg' }],
    ...edge,
    bottom: 0,
    left: 0,
  },
  topLeft: {
    ...edge,
    left: 0,
    top: 0,
  },
  topRight: {
    transform: [{ rotateY: '180deg' }],
    ...edge,
    top: 0,
    right: 0,
  },
})

type ScannerProps = {
  onScan: (_: string) => void
}

export default function Scanner({ onScan }: ScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [scanned, setScanned] = useState(false)

  useEffect(() => {
    const fn = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    }

    fn()
  }, [])

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true)
    onScan(data)
  }

  if (hasPermission === null) {
    return null
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <Camera
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        ratio="16:9"
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.captureBox}>
        <View testID="top-left-corner" style={styles.topLeft} />
        <View testID="top-right-corner" style={styles.topRight} />
        <View testID="bottom-right-corner" style={styles.bottomRight} />
        <View testID="bottom-left-corner" style={styles.bottomLeft} />
      </View>
    </View>
  )
}
