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

export default class RequestCheckCell extends Component {
  constructor(props) {
    super(props);

    let canDelete = false;

    if (this.props.data.Status == 1) {
      canDelete = true;
    } else {
      //check 30 days
      let accountingDateNumber = Number(this.props.data.AccountingDate);
      let todayNumber = Date.parse(new Date());

      if (todayNumber - accountingDateNumber > 2592000000) {
        //30 days
        canDelete = true;
      }
    }

    this.updateDate = Utils.getDayMonthYearString(
      new Date(Number(this.props.data.AccountingDate)),
    );

    this.state = {
      status: this.props.data.Status == 1 ? Language.NOT_SYNC : Language.SYNC,
      canDelete: canDelete,
      date: this.updateDate,
    };
  }

  // componentWillReceiveProps(nextProps) {
  //   this.setState({
  //     status: nextProps.data.Status == 1 ? Language.NOT_SYNC : Language.SYNC,
  //     canDelete: true
  //    });

  //   if (this.props.data.Status == 2) {
  //     this.setState({ canDelete: false })
  //   } else {
  //       //check 30 days

  //       let accountingDateNumber = Number(nextProps.data.AccountingDate);
  //       let todayNumber = Date.parse(new Date());

  //       if (todayNumber - accountingDateNumber < 2592000000) {//30 days
  //         this.setState({ canDelete: false })
  //       }
  //   }
  // }

  static getDerivedStateFromProps(nextProps, prevState) {
    this.delete = false;
    if (nextProps.data.Status == 1) {
      this.delete = true;
    } else {
      //check 30 days

      let accountingDateNumber = Number(nextProps.data.AccountingDate);
      let todayNumber = Date.parse(new Date());

      if (todayNumber - accountingDateNumber > 2592000000) {
        //30 days
        this.delete = true;
      }
    }

    this.updateDate = Utils.getDayMonthYearString(
      new Date(Number(nextProps.data.AccountingDate)),
    );

    return {
      status: nextProps.data.Status == 1 ? Language.NOT_SYNC : Language.SYNC,
      canDelete: this.delete,
      date: this.updateDate,
    };
  }

  _editButton_clicked = () => {
    this.props.editCheckPressed(this.props.data);
  };

  renderButton() {
    if (this.props.data.Status == 1) {
      return (
        <View style={styles.viewButton}>
          <TouchableOpacity onPress={this._editButton_clicked}>
            <Image
              source={require('../resources/edit.png')}
              style={styles.imageIcon}
            />
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  }

  deleteRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }

    this.props.deleteCheckPressed(this.props.data);
  };

  render() {
    return (
      <SwipeRow
        disableRightSwipe
        disableLeftSwipe={!this.state.canDelete}
        rightOpenValue={-70}>
        <View style={styles.rowBack}>
          <TouchableOpacity
            style={[styles.backRightBtn, styles.backRightBtnRight]}
            onPress={() => this.deleteRow(this.props.data.StockTakeID)}>
            <Text style={styles.backTextWhite}>Xoá</Text>
          </TouchableOpacity>
        </View>

        <TouchableHighlight
          style={[
            styles.container,
            this.props.index % 2 == 0
              ? {backgroundColor: '#fff'}
              : {backgroundColor: '#e5e5e5'},
          ]}
          underlayColor="rgba(192,192,192,1)"
          onPress={() => this.props.onPressItem(this.props.data)}>
          <View>
            <View style={[styles.viewTop, {marginTop: 8}]}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={styles.numberLabel}>{this.props.index + 1}.</Text>
                <Text style={styles.nameLabel} numberOfLines={2}>
                  {this.props.data.Name}
                </Text>
              </View>

              {this.renderButton()}
            </View>
            <View style={styles.viewBottom}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.textLabel}>{this.state.date}</Text>
                <Text style={[styles.textLabel, {marginLeft: 20}]}>
                  {this.props.data.StockName}
                </Text>
              </View>

              <Text style={styles.textLabel}>{this.state.status}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </SwipeRow>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:10,
    paddingBottom:10
  },
  viewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numberLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  nameLabel: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '400',
  },
  viewButton: {
    flexDirection: 'row',
    width: 25,
    justifyContent: 'space-between',
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  viewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textLabel: {
    fontSize: 14,
    fontStyle: 'italic',
  },

  backTextWhite: {
    color: '#FFF',
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
});
