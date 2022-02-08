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

import Autocomplete from 'react-native-autocomplete-input';

export default class AddNewProductPOP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrayData: [],
      query: '',
      productID: '',
      productBarCode: '',
      productCode: '',
      productName: '',
      productUnit: '',
      productQuantity: 0,
      productNote: '',
      invoiceDetailID: '',
      invoiceID:'',
      sortOrder: 0,
    };
    this.productQuantity = 0;
    this.selectedProduct = null;
    this.stockTakeID = this.props.stockTakeID;

    this.inputQuantity = React.createRef();
  }

  componentDidMount() {
    db.getListProduct()
      .then(data => {
        this.setState({arrayData: data});
      })
      .catch(err => {});
  }

  //Handle action
  _cancelButton_clicked = () => {
    this.props.cancelEvent();
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
    if(this.props.isTransfer){
      this.setState({productQuantity: 0})
      this._Okbutton_clickOutTransfer()
    }
    else{
      let qVal = Utils.getValueWithNDecimal(this.state.productQuantity, 3);
      let quantity = Number(qVal);
      let note = this.state.productNote;
  
      this._insertNewProduct(this.selectedProduct.model, quantity, note);
      this.props.okEvent();
    }

  };
  changeQuantity = value => {
    let quantity = Utils.checkQuantity(value);
    this.setState({
      productQuantity: quantity,
    });
  };
  //Autocomplete
  findFilm(query) {
    if (query === '') {
      return [];
    }

    query = Utils.removeAccents(query.toString()).toLowerCase();

    const data = this.state.arrayData;
    let result = data.filter(item => {
      let result =
        Utils.removeAccents(item.model.SearchString).indexOf(query) > -1;
      return result;
    });

    return result;
  }

  _handleAutocompleteItem_clicked = item => {
    this.setState({
      query: '',
      productID: item.model.ProductID,
      productBarCode: item.model.BarCode,
      productCode: item.model.Code,
      productName: item.model.Name,
      productUnit: item.model.UnitName,
      productQuantity: '',
      productNote: '',
    });

    this.selectedProduct = item;
    this.inputQuantity.current.focus();
  };
  _Okbutton_clickOutTransfer = () =>{
    let item={
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

    }
    this.props.okEvent(item);
  }

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

          //update product
          db.updateProductStockTakeByDetailID(
            data.DetailID,
            newQuantityString,
            newCount.toString(),
          )
            .then(data => {
              this.inputQuantity.current.focus();
              this.setState({productQuantity: ''});
            })
            .catch(err => {});
        } else {
          product.DetailID = Utils.guidGenerator();
          db.addProductStockTake(
            product,
            this.stockTakeID,
            quantity.toString(),
            this.state.productNote,
            '1',
          )
            .then(data => {
              this.inputQuantity.current.focus();
              this.setState({productQuantity: ''});
            })
            .catch(err => {});
        }
      })
      .catch(err => {});

    const newQuantityString = Utils.getValueWithNDecimal(quantity, 3);
    db.addDetailAddProduct(product, this.stockTakeID, newQuantityString)
      .then(data => {})
      .catch(err => {});
  };

  renderAutoComplete = () => {
    const query = this.state.query;
    const films = this.findFilm(query);

    return (
      <View
        style={{position: 'absolute', zIndex: 1, left: 10, right: 10, top: 60}}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          containerStyle={{
            backgroundColor: 'white',
          }}
          listStyle={{maxHeight: 320, width:'100%'}}
          data={films}
          defaultValue={query}
          autoFocus={true}
          onChangeText={text => this.setState({query: text})}
          placeholder={Language.FIND_PLACEHOLDER}
          style={{
            height: 30,
            paddingLeft: 5,
            paddingVertical: 0,
          }}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => this._handleAutocompleteItem_clicked(item)}>
              <View style={{paddingTop: 20, marginLeft: 10}}>
                <Text>{item.model.Name}({item.model.UnitName})</Text>
                <View
                  style={{height: 0.5, backgroundColor: 'gray', marginTop: 3}}
                />
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.model.ProductID.toString()}
        />
      </View>
    );
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

            {this.renderAutoComplete()}

            {/* Barcode */}
            <View style={[styles.viewItem, {marginTop: 50}]}>
              <Text style={styles.label}>{Language.BARCODE}</Text>
              <TextInput
                style={styles.textInput}
                editable={false}
                value={this.state.productBarCode}
              />
            </View>
            {/* Mã hàng */}
            <View style={styles.viewItem}>
              <Text style={styles.label}>{Language.PRODUCT_CODE}</Text>
              <TextInput
                style={styles.textInput}
                editable={false}
                value={this.state.productCode}
                onChangeText={productCode => this.setState({productCode})}
              />
            </View>

            {/* Tên hàng */}
            <View style={styles.viewItem}>
              <Text style={styles.label}>{Language.PRODUCT_NAME}</Text>
              <TextInput
                style={styles.textInput}
                editable={false}
                value={this.state.productName}
                onChangeText={productName => this.setState({productName})}
              />
            </View>

            
              {/* Đơn vị tính */}
              <View style={styles.viewItem}>
              <Text style={styles.label}>{Language.UNIT}</Text>
              <TextInput
                style={styles.textInput}
                editable={false}
                value={this.state.productUnit}
                onChangeText={productUnit => this.setState({productUnit})}
              />
            </View>
            <KeyboardAvoidingView behavior="padding" enabled>
              {/* Số lượng */}
              <View style={styles.viewItem}>
                <Text style={styles.label}>{Language.QUANTITY}</Text>

                <TextInput
                  ref={this.inputQuantity}
                  style={styles.textInput}
                  keyboardType={'numeric'}
                  value = {this.state.productQuantity.toString()}
                  defaultValue={this.productQuantity.toString()}
                  onChangeText={value => {
                    this.changeQuantity(value);
                  }}
                />
              </View>
              {/* Ghi chú */}
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
                style={styles.findButtonexit}
                onPress={this._cancelButton_clicked}>
                <Text style={styles.textButton2}>{Language.CANCEL}</Text>
              </TouchableOpacity>
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
    width: 120,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  findButtonexit: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5EB45F',
    width: 120,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textButton2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999999',
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
