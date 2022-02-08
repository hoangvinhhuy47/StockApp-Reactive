import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from 'react-native';
import Utils from '../common/Utils.js';
import Language from '../resources/Language.js';
import {SwipeRow} from 'react-native-swipe-list-view';
export default class ItemWHouseTransferCell extends Component {
  constructor(props) {
    super(props);
    this.updateDate = Utils.getDayMonthYearHourStringDetail(
      this.props.data.AccountingDate,
    );
    this.state = {
      date: this.updateDate,
    };
  }
  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  // _clickConfirm = () => {
  //   this.props.onPressItem(this.props.data);
  // };
  _renderPostted = () => {
    if (this.props.data.IsPosted) {
      return (
        <View>
          <Image
            style={styles.imageArrow2}
            source={require('../resources/check.png')}
          />
        </View>
      );
    } else {
      return (
        <View>
          <Image
            style={styles.imageArrow2}
            source={require('../resources/noncheck.png')}
          />
        </View>
      );
    }
  };
  deleteRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }

    this.props.deleteCheckPressed(this.props.data);
  };
  render() {
    return (
      <SwipeRow disableRightSwipe rightOpenValue={-70}>
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => this.deleteRow(this.props.data.InvoiceID)}>
            <Text style={styles.backTextWhite}>Xoá</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[
            styles.container,
            this.props.index % 2 == 0
              ? {backgroundColor: '#fff'}
              : {backgroundColor: '#e5e5e5'},
          ]}
          underlayColor="rgba(192,192,192,1)"
          onPress={this.props.onPressItem}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', marginLeft: 5}}>
              <Text style={[
                styles.Txt,
                this.props.data.StatusName == 'Mở' 
                ? {color: 'blue'} : this.props.data.StatusName == 'Đang chuyển hàng' ? {color: '#61C490'} : {color: '#000'}
              ]}>{this.props.index + 1}. </Text>
              <Text style={[
                styles.TxtOrdercode,
                this.props.data.StatusName == 'Mở' 
                ? {color: 'blue'} : this.props.data.StatusName == 'Đang chuyển hàng' ? {color: '#61C490'} : {color: '#000'}
              ]}>
                {this.props.data.InvoiceCode}
              </Text>
            </View>
            <View style={{marginRight: 5}}>
              <Text style={[
                styles.Txt,
                this.props.data.StatusName == 'Mở' 
                ? {color: 'blue'} : this.props.data.StatusName == 'Đang chuyển hàng' ? {color: '#61C490'} : {color: '#000'}
              ]}>{this.state.date}</Text>
            </View>
          </View>
          <View style={styles.groupBottom}>
            <View
              style={{
                marginLeft: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={[
                styles.Txt,
                this.props.data.StatusName == 'Mở' 
                ? {color: 'blue'} : this.props.data.StatusName == 'Đang chuyển hàng' ? {color: '#61C490'} : {color: '#000'}
              ]}>{this.props.data.FromStockName}</Text>
              <Image
                style={styles.imageArrow}
                source={require('../resources/right-arrow.png')}
              />
              <Text style={[
                styles.Txt3,
                this.props.data.StatusName == 'Mở' 
                ? {color: 'blue'} : this.props.data.StatusName == 'Đang chuyển hàng' ? {color: '#61C490'} : {color: '#000'}
              ]}>{this.props.data.ToStockName}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>{this._renderPostted()}</View>
            </View>
          </View>
        </TouchableOpacity>
      </SwipeRow>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'column',
    height: 70,
    justifyContent: 'space-around',
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
    fontSize: 15,
    textTransform: 'capitalize',
  },
  Txt2: {
    fontSize: 15,
  },
  TxtOrdercode: {
    fontStyle: 'italic',
    fontSize: 15,
    fontWeight: '700',
  },
  groupBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: '1%',
    marginRight: '1%',
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
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
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
});
