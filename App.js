import * as React from 'react';
import { View, StyleSheet, Button, Platform, Text, TextInput, Image, SafeAreaView } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

export default function App() {
  const [selectedPrinter, setSelectedPrinter] = React.useState();
  const [itemName, setItemName] = React.useState('');
  const [itemPrice, setItemPrice] = React.useState('');
  const [receiptItems, setReceiptItems] = React.useState([]);

  const printReceipt = async () => {
    const receiptHTML = generateReceiptHTML();

    await Print.printAsync({
      html: receiptHTML,
      printerUrl: selectedPrinter?.url, 
    });
  };

  const printReceiptToFile = async () => {
    const receiptHTML = generateReceiptHTML();

    const { uri } = await Print.printToFileAsync({ html: receiptHTML });
    console.log('Receipt file has been saved to:', uri);

    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  };

  const generateReceiptHTML = () => {
    let itemsHTML = '';
    let total = 0;
    receiptItems.forEach(item => {
      itemsHTML += `<p>${item.name}: $${item.price}</p>`;
    total += parseFloat(item.price);
    });

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="text-align: left; padding: 20px;">
          <h1 style="text-align: center; font-size: 40px;">Insyllium</h1>
          <hr />
          <h1>Receipt</h1>
          <h5>Date: ${currentDate} - Time: ${currentTime}</h5>
          ${itemsHTML}
          <h6 style="font-weight: bold; font-size: 16px;">Total: $${total.toFixed(2)}</h6>
          <hr />
          <p style="text-align: center">Thanks for choosing us</p>
        </body>
      </html>
    `;
  };

  const addItem = () => {
    if (itemName && itemPrice) {
      const newItem = { name: itemName, price: parseFloat(itemPrice).toFixed(2) };
      setReceiptItems([...receiptItems, newItem]);
      setItemName('');
      setItemPrice('');
    }
  };

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); 
    setSelectedPrinter(printer);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{display: "flex", alignItems: 'center'}}>
        <Image
          style={styles.logo}
          source={require("./assets/logo.png")}
          contentFit="cover"
          transition={1000}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter item name"
        value={itemName}
        placeholderTextColor="gray"
        onChangeText={text => setItemName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter item price"
        keyboardType="numeric"
        value={itemPrice}
        placeholderTextColor="gray"
        onChangeText={text => setItemPrice(text)}
      />
      <Button title="Add Item" onPress={addItem} />
      <Button title="Print Receipt" onPress={printReceipt} style={{marginTop: 10}} />
      <View style={styles.spacer} />
      <Button title="Print Receipt to PDF" onPress={printReceiptToFile} />
      {Platform.OS === 'ios' && (
        <>
          <View style={styles.spacer} />
          <Button title="Select Printer" onPress={selectPrinter} />
          <View style={styles.spacer} />
          {selectedPrinter ? (
            <Text style={styles.printer}>{`Selected printer: ${selectedPrinter.name}`}</Text>
          ) : undefined}
        </>
      )}
      <View style={styles.receipt}>
        <Text style={styles.receiptTitle}>Receipt Items:</Text>
        {receiptItems.map((item, index) => (
          <Text key={index} style={styles.receiptItem}>{`${item.name}: $${item.price}`}</Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgb(0, 0, 33)',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: "#fff",
  },
  spacer: {
    height: 20,
  },
  printer: {
    textAlign: 'center',
  },
  receipt: {
    marginTop: 20,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  receiptItem: {
    marginBottom: 5,
    color: "#fff"
  },

});
