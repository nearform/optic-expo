/* eslint-disable @typescript-eslint/no-var-requires */

import { registerRootComponent } from 'expo'

global.Buffer = global.Buffer || require('buffer').Buffer

import App from './App'

registerRootComponent(App)
