import React from 'react'
import { Divider, Menu, IconButton } from 'react-native-paper'

type ContextMenuProps = {
  open: boolean
  onToggle: () => void
  onRefresh?: () => void
  onRevoke?: () => void
  onDelete: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  open,
  onToggle,
  onRefresh,
  onRevoke,
  onDelete,
}) => {
  return (
    <Menu
      visible={open}
      onDismiss={onToggle}
      anchor={
        <IconButton
          icon="dots-vertical"
          accessibilityLabel="toggle-menu"
          size={24}
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
      <Menu.Item onPress={onDelete} title="Delete secret" icon="delete" />
    </Menu>
  )
}
