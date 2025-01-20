import { StyleSheet, View, ScrollView } from 'react-native'
import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { TextInput, Text, Divider, FAB, Portal, List } from 'react-native-paper'
import { useIsFocused } from '@react-navigation/core'

import { MainStackParamList } from '../Main'
import theme from '../lib/theme'
import { useSecretSelector } from '../hooks/use-secret-selector'
import { Typography } from '../components/Typography'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(3),
  },
  noTokens: {
    marginTop: theme.spacing(8),
    padding: theme.spacing(4),
  },
  noTokensTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(1),
  },
  noTokensBody: {
    textAlign: 'center',
  },
  searchArea: {
    marginBottom: theme.spacing(2),
  },
  scrollView: {
    flexGrow: 1,
  },
  tokensCount: {
    marginBottom: theme.spacing(2),
  },
  tokensCountLabel: {
    marginRight: theme.spacing(2),
  },
  tokensCountValue: theme.typography.overline,
  tokenItem: {
    paddingHorizontal: 0,
    paddingVertical: theme.spacing(1),
    // React native paper doesn't allow overriding this https://github.com/callstack/react-native-paper/blob/b545cdcbd8c5f1bd5ad3f0e9f095c294527846a4/src/components/List/ListItem.tsx#L263
    // Needed to override the padding that's hardcoded there
    marginLeft: -8,
  },
  tokenValueText: {
    ...theme.typography.code,
    marginBottom: theme.spacing(1),
  },
  tokenDescriptionText: {
    ...theme.typography.body2,
    color: theme.colors.text,
    marginHorizontal: 0,
  },
  fab: {
    backgroundColor: theme.colors.primary,
    position: 'absolute',
    margin: theme.spacing(3),
    bottom: 0,
    alignSelf: 'center',
  },
})

type Props = NativeStackScreenProps<MainStackParamList, 'TokensList'>

export const TokensListScreen = ({ route, navigation }: Props) => {
  const { navigate } = navigation
  const { secretId } = route.params
  const secret = useSecretSelector(secretId)
  const tokens = useMemo(() => (secret.tokens ? secret.tokens : []), [secret])
  const tokensCount = tokens.length
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const isFocused = useIsFocused()
  const shouldShowFab = isFocused && !searchFocused

  const filteredTokens = useMemo(() => {
    if (search.length > 1) {
      return tokens.filter(
        ({ token, description }) =>
          description.toLowerCase().includes(search.toLowerCase()) ||
          token.toLowerCase().includes(search.toLowerCase())
      )
    } else {
      return tokens
    }
  }, [search, tokens])

  const handleCreateToken = useCallback(() => {
    navigate('CreateToken', { secretId })
  }, [navigate, secretId])

  return (
    <>
      <View style={styles.container}>
        {tokensCount > 1 && (
          <>
            <Text style={styles.tokensCount}>
              <Typography variant="code" style={styles.tokensCountLabel}>
                {tokensCount}
              </Typography>{' '}
              <Text style={styles.tokensCountValue}>
                {tokensCount === 1 ? 'TOKEN' : 'TOKENS'}
              </Text>
            </Text>
            <View style={styles.searchArea}>
              <TextInput
                autoComplete="off"
                textAlign="left"
                label="Search"
                accessibilityLabel="Search"
                placeholder="Search..."
                placeholderTextColor={theme.colors.disabled}
                autoCorrect={false}
                mode="outlined"
                value={search}
                onChangeText={setSearch}
                right={<TextInput.Icon icon="magnify" />}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </View>
          </>
        )}
        {tokensCount === 0 ? (
          <View style={styles.noTokens}>
            <Typography variant="h5" style={styles.noTokensTitle}>
              No Tokens
            </Typography>
            <Typography variant="body1" style={styles.noTokensBody}>
              Create a new token and it will appear here.
            </Typography>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 180 }}
          >
            {filteredTokens.map(({ token, description }) => (
              <Fragment key={token}>
                <List.Item
                  onPress={() =>
                    navigation.navigate('Token', { secretId, token })
                  }
                  style={styles.tokenItem}
                  title={token}
                  titleStyle={styles.tokenValueText}
                  description={description}
                  descriptionStyle={styles.tokenDescriptionText}
                  descriptionNumberOfLines={1}
                  right={({ style, ...props }) => (
                    <List.Icon
                      {...props}
                      icon="chevron-right"
                      style={{ ...style, alignSelf: 'center' }}
                    />
                  )}
                />
                <Divider />
              </Fragment>
            ))}
          </ScrollView>
        )}
      </View>
      <Portal>
        <FAB
          visible={shouldShowFab}
          label="Create Token"
          icon="plus"
          small
          style={styles.fab}
          onPress={handleCreateToken}
        />
      </Portal>
    </>
  )
}
