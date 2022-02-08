import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import database from '../Database.js';
const db = database();

export default class AddNewProductScanPOP extends Component {
  constructor(props) {
    super(props);

    this.selectedProduct = this.props.selectedProduct;
    this.stockTakeID = this.props.stockTakeID;

    let quantity = this.selectedProduct.Quantity;

    this.state = {
      productID: this.selectedProduct.ProductID,
      productBarCode: this.selectedProduct.BarCode,
      productCode: this.selectedProduct.Code,
      productName: this.selectedProduct.Name,
      productUnit: this.selectedProduct.UnitName,
      productQuantity: quantity !== 'undefined' ? quantity : '',
      productNote: '',
      invoiceDetailID: '',
      invoiceID: '',
      sortOrder: 0,
    };

    this.inputQuantity = React.createRef();
  }

  componentDidMount() {
    this.inputQuantity.current.focus();
  }
  // _OkandscanButton_clicked = () => {
  //   this.props.hidePopupEvent();
  // };

  //Handle action
  _cancelButton_clicked = () => {
    this.props.hidePopupEvent();
  };

  _okButton_clicked = () => {
    if (
      this.state.productQuantity === '0' ||
      this.state.productQuantity === '' ||
      this.state.productQuantity === undefined
    ) {
      Utils.showAlert(Language.INPUT_QUANTITY);
      return;
    }
    if (this.props.isTransfer) {
      this._Okbutton_clickOutTransfer();
    } else {
      let qVal = Utils.getValueWithNDecimal(this.state.productQuantity, 3);
      let quantity = Number(qVal);
      this._insertNewProduct(
        this.selectedProduct,
        quantity,
        this.state.productNote,
      );
      this.props.hidePopupEvent();
    }
  };
  changeQuantity = value => {
    let quantity = Utils.checkQuantity(value);
    this.setState({
      productQuantity: quantity,
    });
  };
  _Okbutton_clickOutTransfer = () => {
    let item = {
      ProductID: this.state.productID,
      Barcode: this.state.productBarCode,
      ProductCode: this.state.productCode,
      ProductName: this.state.productName,
      UnitName: this.state.productUnit,
      Quantity: parseFloat(this.state.productQuantity),
      Notes: this.state.productNote,
      InvoiceDetailID: this.state.invoiceDetailID,
      InvoiceID: this.state.invoiceID,
      SortOrder: this.state.sortOrder,
    };
    this.props.successPopupEvent(item);
    
  };

  //Insert data
  _insertNewProduct = (product, quantity, notes) => {
    let productID = product.ProductID;

    db.getProductStockTakeByStockTakeIDAndProductID(this.stockTakeID, productID)
      .then(data => {
        if (data != null) {
          //exist
          let newQuantity = Number(data.Quantity) + quantity;
          let newQuantityString = Utils.getValueWithNDecimal(newQuantity, 3);
          let newCount = Number(data.Count) + 1;

          let arr = newQuantityString.split('.');
          if (arr.length == 2) {
            if (arr[1].length > 3) {
              newQuantity = Number(newQuantityString).toFixed(3);
            }
          }

          console.log(
            'old quantity' +
              data.Quantity +
              ' quantity ' +
              quantity +
              ' new quantity ' +
              newQuantity,
          );

          //update product
          db.updateProductStockTakeByDetailID(
            data.DetailID,
            newQuantity.toString(),
            newCount.toString(),
          )
            .then(data => {
              // this._getListProductStockTake();
            })
            .catch(err => {});
        } else {
          product.DetailID = Utils.guidGenerator();

          db.addProductStockTake(
            product,
            this.stockTakeID,
            quantity.toString(),
            notes,
            '1',
          )
            .then(data => {})
            .catch(err => {});
        }
      })
      .catch(err => {});

    const newQuantityString = Utils.getValueWithNDecimal(quantity, 3);
    db.addDetailAddProduct(product, this.stockTakeID, newQuantityString)
      .then(data => {})
      .catch(err => {});
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.containerItem}>
            <View style={styles.headerView}>
              <Text style={styles.headerTitle}>{Language.ADD_NEW}</Text>
              <TouchableOpacity onPress={this._cancelButton_clicked}>
                <Image
                  style={styles.buttonLogout}
                  source={require('../resources/close.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.viewLine} />

            {/* Barcode *} */}
            <View style={[styles.viewItem, {marginTop: 7}]}>
              <Text style={styles.label}>{Language.BARCODE}</Text>
              <TextInput
                style={styles.textInput}
                editable={false}
                value={this.state.productBarCode}
              />
            </View>
            {/* Mã hàng *} */}
            <View style={styles.viewItem}>
              <Text style={styles.label}>{Language.PRODUCT_CODE}</Text>
              <TextInput
                style={styles.textInput}
                editable={false}
                value={this.state.productCode}
                onChangeText={productCode => this.setState({productCode})}
              />
            </View>

            {/* Tên hàng *} */}
            <View style={styles.viewItem}>
              <Text style={styles.label}>{Language.PRODUCT_NAME}</Text>
              <TextInput
                style={styles.textInput}
                editable={false}
                value={this.state.productName}
                onChangeText={productName => this.setState({productName})}
              />
            </View>

            <KeyboardAvoidingView behavior="padding" enabled>
              {/* Số lượng *} */}
              <View style={styles.viewItem}>
                <Text style={styles.label}>{Language.QUANTITY}</Text>
                <TextInput
                  ref={this.inputQuantity}
                  style={styles.textInput}
                  keyboardType={'decimal-pad'}
                  value={this.state.productQuantity}
                  onChangeText={productQuantity =>
                    this.setState({productQuantity})
                  }
                />
              </View>

              {/* Ghi chú *} */}
              <View style={styles.viewItem}>
                <Text style={styles.label}>{Language.NOTE}</Text>
                <TextInput
                  style={styles.textInput}
                  value={this.state.productNote}
                  onChangeText={productNote => this.setState({productNote})}
                />
              </View>
            </KeyboardAvoidingView>

            <View style={styles.viewBottomButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={this._cancelButton_clicked}>
                <Text style={styles.textButton}>{Language.CANCEL}</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.button}
                onPress={this._OkandscanButton_clicked}
                >
                <Text style={styles.textButton}>{Language.OKANDCANCEL}</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.button}
                onPress={this._okButton_clicked}>
                <Text style={styles.textButton}>{Language.OK}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  containerItem: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  headerView: {
    height: 45,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
  },
  buttonLogout: {
    width: 20,
    height: 20,
  },
  viewLine: {
    height: 1,
    backgroundColor: 'black',
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    width: 100,
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    height: 30,
    marginLeft: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  button: {
    borderWidth: 1,
    backgroundColor: '#5EB45F',
    borderColor: '#20A422',
    width: 110,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButton: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  autocompleteContainer: {
    backgroundColor: 'red',
    borderWidth: 0,
  },
  viewBottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
});
