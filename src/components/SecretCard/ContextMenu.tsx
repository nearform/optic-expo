import React from 'react'
import { Menu, IconButton } from 'react-native-paper'

type ContextMenuProps = {
  open: boolean
  onToggle: () => void
  onDelete: () => void
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  open,
  onToggle,
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
        onPress={onDelete}
        title="Delete secret"
        leadingIcon="delete"
      />
    </Menu>
  )
}
