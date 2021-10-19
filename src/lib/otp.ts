import { Authenticator } from '@otplib/core'
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js'
import { keyDecoder, keyEncoder } from '@otplib/plugin-base32-enc-dec'

global.Buffer = global.Buffer || require('buffer').Buffer

export const authenticator = new Authenticator({
  createDigest,
  createRandomBytes,
  keyDecoder,
  keyEncoder,
})

export default {
  generate(secret) {
    return authenticator.generate(secret)
  },

  timeRemaining() {
    return authenticator.timeRemaining()
  },
}
