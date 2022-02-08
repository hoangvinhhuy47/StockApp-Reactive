import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import Utils from '../common/Utils.js';
import Language from '../resources/Language.js';
import {SwipeRow} from 'react-native-swipe-list-view';
export default class ItemWHouseImportTransferDetailCell extends Component {
  constructor(props) {
    super(props);
    let canDelete = false;
    let isPosted = this.props.isPost;
    this.state = {
      quantityInput: props.data.Quantity,
      quantityInput2: props.data.Quantity,
      canDelete: canDelete,
      isPosted: isPosted,
      isQuantity: false,
    };
    this.quantityInputRef = React.createRef();
    this.noteInputRef = React.createRef();
  }
  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  removeForbiddenCharacters = input => {
    let forbiddenChars = ['/', '*', '+'];

    for (let char of forbiddenChars) {
      input = input.split(char).join('');
    }
    return input;
  };
  changeQuantity = value => {
    value = this.removeForbiddenCharacters(value);
    let temp_Quantity = parseFloat(value);
    let quantity = isNaN(temp_Quantity) ? 0 : temp_Quantity;
    if (quantity >= 0) {
      quantity = value;
    } else {
      quantity = 0;
    }
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
  _deleteButton_clicked = () => {
    this.props.onDeleteEvent(this.props.data);
  };
  // componentDidUpdate(preProps, preState) {
  //   if (preProps.data.Quantity != preState.quantityInput){
  //     console.log('aaaaaaa')
  //     this.setState({quantityInput: this.props.data.Quantity });
  //   }
  // }
  static getDerivedStateFromProps(nextProps) {
    return {quantityInput: nextProps?.data?.Quantity};
  }
  render() {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          this.props.index % 2 == 0
            ? {backgroundColor: '#fff'}
            : {backgroundColor: '#e5e5e5'},
        ]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.Txt}>{this.props.index + 1}. </Text>
            <Text style={styles.TxtOrdercode}>
              {this.props.data.ProductName}({this.props.data.UnitName})
            </Text>
          </View>
        </View>
        <View style={styles.groupBottom}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.Txt2}>SL gốc: </Text>
              <Text style={styles.Txt3}>
                {this.props.data.QuantityRefInvoice}
              </Text>
            </View>
          </View>
          <View style={styles.groupsld}>
            <Text style={styles.Txt2}>SL đã nhận: </Text>
            <Text style={styles.Txt3}>
              {this.props.data.QuantityInventory}
            </Text>
          </View>
          <View style={styles.groupsld}>
            <Text style={styles.Txt2}>SL nhận: </Text>
            <TextInput
              editable={!this.state.isPosted, 
              this.props.data.QuantityInventory >= this.props.data.QuantityRefInvoice ? false : true}
              keyboardType="numeric"
              maxLength={15}
              style={[
                styles.textinput,
                this.state.isPosted == true ? {opacity: 0.4} : {},
                this.props.data.QuantityInventory >= this.props.data.QuantityRefInvoice ? {opacity: 0.4} : {},
              ]}
              onChangeText={value => {
                this.changeQuantity(value);
              }}
              value={this.state.quantityInput.toString()}
              defaultValue={this.props.data.Quantity.toString()}
            />
          </View>
        </View>
        <View style={{marginTop: 5}}>
          <TextInput
            editable={!this.state.isPosted}
            placeholder="Ghi chú"
            keyboardType="default"
            defaultValue={this.props.data.Notes}
            style={[
              styles.textinput2,
              this.state.isPosted == true ? {opacity: 0.4} : {},
            ]}
            onChangeText={value => {
              this.changeNotes(value);
            }}
            maxLength={100}
          />
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 8,
    flexDirection: 'column',
    justifyContent: 'space-around',
    zIndex: 99,
  },
  groupTT: {
    paddingLeft: 3,
    width: '85%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  groupBT: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonAC: {
    height: 25,
    width: 25,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageBT: {
    height: 20,
    width: 20,
  },
  Txt: {
    fontStyle: 'italic',
    fontSize: 15,
  },
  Txt3: {
    fontStyle: 'italic',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  Txt2: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  TxtOrdercode: {
    width: 300,
    fontStyle: 'italic',
    fontSize: 15,
    fontWeight: '700',
  },
  groupBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '1%',
    marginRight: '1%',
    alignItems: 'center',
  },
  imageArrow: {
    marginHorizontal: 5,
    width: 10,
    height: 10,
  },
  imageArrow2: {
    marginLeft: 5,
    width: 15,
    height: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
  groupsld: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textinput: {
    marginRight: 8,
    marginLeft: 2,
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
});
