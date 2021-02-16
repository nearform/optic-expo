import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import { Appbar, IconButton, Text, Subheading } from 'react-native-paper'

import theme from '../default-theme'

const UI_STRINGS = {
  default: {
    heading: `You don't have a secret set up yet.`,
    description:
      'Add one by scanning or uploading a QR code, or even enter the details manually.',
  },
}

const A11Y_LABELS = {
  code: 'Add new secret by scanning a QR Code',
  upload: 'Add new secret by uploading a QR Code',
  add: 'Add new secret by filling the details',
}
export default function Home() {
  return (
    <View style={styles.container}>
      <Appbar style={styles.bottom}>
        <Appbar.Content title={<Text style={styles.title}>Optic</Text>} />
        <Appbar.Action icon="account" onPress={console.log} />
      </Appbar>
      <View style={styles.description}>
        <Subheading style={styles.descriptionText}>
          {UI_STRINGS.default.heading}
        </Subheading>
        <Subheading style={styles.descriptionText}>
          {UI_STRINGS.default.description}
        </Subheading>
      </View>
      <View style={styles.actions}>
        <IconButton
          icon="qrcode"
          accessibilityLabel={A11Y_LABELS.code}
          mode="contained"
          style={styles.button}
          size={40}
          color={theme.colors.white}
        />
        <IconButton
          icon="upload"
          accessibilityLabel={A11Y_LABELS.upload}
          mode="contained"
          style={styles.button}
          size={40}
          color={theme.colors.white}
        />
        <IconButton
          icon="import"
          accessibilityLabel={A11Y_LABELS.add}
          mode="contained"
          style={styles.button}
          size={40}
          color={theme.colors.white}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    paddingTop: theme.spacing.small,
    width: '100%',
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.white,
    fontSize: theme.text.small,
    fontWeight: '700',
  },
  button: {
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
  },
  description: {
    paddingTop: theme.spacing.small,
    paddingBottom: theme.spacing.small,
    paddingLeft: theme.spacing.tiny,
    paddingRight: theme.spacing.tiny,
  },
  descriptionText: {
    marginBottom: theme.spacing.tiny,
  },
})
