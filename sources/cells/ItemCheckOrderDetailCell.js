import React, {Component} from 'react';
import {StyleSheet, View, Text, TextInput, Touchable} from 'react-native';
import Utils from '../common/Utils.js';
export default class ItemCheckOrderDetailCell extends Component {
  constructor(props) {
    super(props);
    let orderReturnTyped = this.props.orderReturnType;
    this.state = {
      updateCurrency: Utils.getcurrency(this.props.data.Price) + ' đ',
      quantityInput: this.props.data.Quantity,
      isError: false,
      orderReturnTyped: orderReturnTyped,
    };
    this.quantityInputRef = React.createRef();
    this.noteInputRef = React.createRef();
  }

  changeQuantity = value => {
    let quantity = Utils.checkQuantity(value);
    this.setState({
      quantityInput: quantity,
    });

    this.props.data.Quantity = quantity;
    this.props.changeQuantity && this.props.changeQuantity(this.props.data);
  };
  changeNotes = value => {
    this.props.data.Notes = value;
    this.props.changeQuantity && this.props.changeQuantity(this.props.data);
  };

  // changeCurrenty = () =>{
  //   let currencyString = Utils.getcurrency(this.props.data.Price);
  // }
  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.index % 2 == 0
            ? {backgroundColor: '#fff'}
            : {backgroundColor: '#e5e5e5'},
        ]}>
        <View style={styles.groupTT}>
          <View style={{flexDirection: 'row', marginLeft: 3}}>
            <Text style={styles.Txt4}>{this.props.index + 1}. </Text>
            <Text style={styles.Txt2}>
              {this.props.data.ProductName}({this.props.data.UnitName})
            </Text>
          </View>
        </View>
        <View style={styles.groupTT2}>
          <View
            style={{
              flexDirection: 'row',
              marginLeft: 3,
              marginTop: 5,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.Txt}>{this.state.updateCurrency}</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.Txt}>Tồn: </Text>
                <Text style={styles.Txt}>{this.props.data.BalanceQuantity} / </Text>
                <Text style={styles.Txt5}>{this.props.data.OrderQuantity}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.Txt}>Đặt: </Text>
                <Text style={styles.Txt}>{this.props.data.QuantityOrg}</Text>
              </View>
            </View>
            {this.state.orderReturnTyped == 3 ? (
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.Txt}>Đã duyệt: </Text>
                <Text style={styles.Txt}>
                  {this.props.data.QuantityInventoryApproval}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
        <View style={styles.groupTT2}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 5,
              marginTop: 5,
            }}>
            <View style={styles.groupsld}>
              <Text style={styles.Txt}>SL duyệt: </Text>
              <TextInput
                keyboardType="numeric"
                maxLength={15}
                style={styles.textinput}
                onChangeText={value => {
                  this.changeQuantity(value);
                }}
                value={this.state.quantityInput.toString()}
                defaultValue={this.props.data.Quantity.toString()}
              />
            </View>
            <View style={{flex: 3}}>
              <TextInput
                placeholder="Ghi chú"
                keyboardType="default"
                defaultValue={this.props.data.Notes}
                Value={this.props.data.Notes}
                style={styles.textinput2}
                maxLength={100}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: '0.4%',
    flexDirection: 'column',
    height: '20%',
    paddingRight: 10,
    paddingVertical: 5,
    justifyContent: 'space-around',
    zIndex: 99,
  },
  groupTT: {
    paddingLeft: '1%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  groupTT2: {
    marginLeft: '4%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  groupBT: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonAC: {
    height: '4%',
    width: '4%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageBT: {
    height: '3%',
    width: '3%',
  },
  Txt: {
    fontStyle: 'italic',
    fontSize: 13,
  },
  Txt5: {
    fontStyle: 'italic',
    fontSize: 13,
    color:'#ca0000'
  },
  Txt4: {
    fontStyle: 'italic',
    fontSize: 15,
  },
  Txt3: {
    fontStyle: 'italic',
    fontSize: 12,
  },
  Txt2: {
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  groupBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '1%',
    marginRight: '1%',
  },
  textinput: {
    marginRight: 8,
    width: 60,
    height: 30,
    backgroundColor: '#fff',
    borderColor: 'gray',
    color: 'black',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingVertical: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  textinput2: {
    width: '100%',
    marginRight: 8,
    height: 30,
    color: 'black',
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingVertical: 0,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  groupsld: {
    flex: 1,
    marginRight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
