import { Buffer as BufferImport } from 'buffer'

import { registerRootComponent } from 'expo'

import App from './src/App'

global.Buffer = global.Buffer || BufferImport

registerRootComponent(App)
