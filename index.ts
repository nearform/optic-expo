/* eslint-disable @typescript-eslint/no-require-imports */

import { registerRootComponent } from 'expo'

global.Buffer = global.Buffer || require('buffer').Buffer

import App from './src/App'

registerRootComponent(App)
