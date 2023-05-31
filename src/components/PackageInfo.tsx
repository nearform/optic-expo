import { StyleSheet, View } from 'react-native'
import theme from '../lib/theme'
import { Typography } from './Typography'

const styles = StyleSheet.create({
  packageInfo: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
})

type PackageInfoProps = {
  packageInfo: {
    version?: string
    name?: string
  }
}

export const PackageInfo: React.FC<PackageInfoProps> = ({
  packageInfo: { version, name } = {},
}) => {
  return (
    <View style={styles.packageInfo}>
      {name && (
        <View>
          <Typography variant="overline">Package</Typography>
          <Typography variant="body1">{name}</Typography>
        </View>
      )}
      {version && (
        <View>
          <Typography variant="overline">Version</Typography>
          <Typography variant="body1">{version}</Typography>
        </View>
      )}
    </View>
  )
}
