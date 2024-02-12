import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeComponent = ({ data }) => {
  return (
    <View>
      <QRCode value={data} size={200} />
    </View>
  );
};

export default QRCodeComponent;
