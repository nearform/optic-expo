import { Authenticator } from '@otplib/core'
import { createDigest, createRandomBytes } from '@otplib/plugin-crypto-js'
import { keyDecoder, keyEncoder } from '@otplib/plugin-base32-enc-dec'

export const authenticator = new Authenticator({
  createDigest,
  createRandomBytes,
  keyDecoder,
  keyEncoder,
})

export default {
  generate(secret) {
    try {
      return authenticator.generate(secret)
    } catch (err) {
      console.error('failed to generate secret')
      return '-'
    }
  },

  timeRemaining() {
    return authenticator.timeRemaining()
  },
}
