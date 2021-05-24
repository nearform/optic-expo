import React from 'react'

const nativeEvent = {
  bounds: {},
  cornerPoints: [],
  data: 'otpauth://hotp/test?secret=mock-qr-secret&algorithm=SHA256&digits=6&period=30&counter=0',
  target: 329,
  type: 'org.iso.QRCode',
}

class BarCodeScanner extends React.Component {
  constructor(props) {
    super(props)
    const { onBarCodeScanned } = this.props
    // Simulate a native barcode event
    onBarCodeScanned(nativeEvent)
  }

  static requestPermissionsAsync() {
    return Promise.resolve({ status: 'granted' })
  }

  render() {
    return <div>mock</div>
  }
}

export { BarCodeScanner }
