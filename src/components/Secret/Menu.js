import React from 'react'
import { Divider, Menu, IconButton } from 'react-native-paper'

export default function ContextMenu({
  open,
  onToggle,
  onRefresh,
  onRevoke,
  onDelete,
}) {
  return (
    <Menu
      visible={open}
      onDismiss={onToggle}
      anchor={
        <IconButton
          icon="dots-vertical"
          accessibilityLabel="toggle-menu"
          size={24}
          mode="contained"
          onPress={onToggle}
        />
      }
    >
      <Menu.Item
        onPress={onRefresh}
        title="Refresh token"
        icon="refresh"
        disabled={!onRefresh}
      />
      <Divider />
      <Menu.Item
        onPress={onRevoke}
        title="Revoke token"
        icon="minus"
        disabled={!onRevoke}
      />
      <Divider />
      <Menu.Item
        onPress={() => {}}
        title="Edit details"
        icon="pencil"
        disabled
      />
      <Divider />
      <Menu.Item onPress={onDelete} title="Delete secret" icon="delete" />
    </Menu>
  )
}
