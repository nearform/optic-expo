import otpauth from 'url-otpauth'

/**
 * Parses a OTP url
 * @param {string} content
 */
export async function parse(content) {
  const { issuer, key: secret, account } = otpauth.parse(content)
  return { issuer, account, secret }
}
