import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TouchableHighlight,
} from 'react-native';
import Utils from '../common/Utils.js';
import Language from '../resources/Language.js';
export default class ItemCheckOderCell extends Component {
  constructor(props) {
    super(props);
    this.updateDate = Utils.getDayMonthYearHourStringDetail(this.props.data.AccountingDate);
    this.state = {
      date: this.updateDate,
    };
  }
  Capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  _clickConfirm = () => {
    this.props.onPressItem(this.props.data);
  };
  render() {
    // console.log(this.props.data);
    return (
      <TouchableOpacity
        onPress={this._clickConfirm}
        style={[
          styles.container,
          this.props.index % 2 == 0
            ? {backgroundColor: '#fff'}
            : {backgroundColor: '#e5e5e5'},
        ]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', marginLeft: 5}}>
              <Text style={[
                styles.Txt,
                this.props.data.OrderReturnType == 3 ? {color: '#61C490'} : this.props.data.OrderReturnType == 2 ? {color: 'blue'} : {color: '#000'}
                ]}>{this.props.index + 1}. </Text>
              <Text style={[styles.TxtOrdercode,
              this.props.data.OrderReturnType == 3 ? {color: '#61C490'} : this.props.data.OrderReturnType == 2 ? {color: 'blue'} : {color: '#000'}
              ]}>
                {this.props.data.OrderCode}
              </Text>
            </View>
            <View style={{marginLeft: 5}}>
              <Text style={[styles.Txt,
              this.props.data.OrderReturnType == 3 ? {color: '#61C490'} : this.props.data.OrderReturnType == 2 ? {color: 'blue'} : {color: '#000'}
              ]}>{this.state.date}</Text>
            </View>
        </View>
        <View style={styles.groupBottom}>
          <View style={{marginLeft: 5, flexDirection: 'row'}}>
            <Text style={[styles.Txt,
            this.props.data.OrderReturnType == 3 ? {color: '#61C490'} : this.props.data.OrderReturnType == 2 ? {color: 'blue'} : {color: '#000'}
            ]}>
              {this.props.data.CustomerCode}
              {'_'}
            </Text>
            <Text style={[styles.Txt3,
            this.props.data.OrderReturnType == 3 ? {color: '#61C490'} : this.props.data.OrderReturnType == 2 ? {color: 'blue'} : {color: '#000'}
            ]}>{this.props.data.CustomerName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 10,
    flexDirection: 'column',
    height: 70,
    justifyContent: 'space-around',
    zIndex: 99,
  },
  groupTT: {
    paddingLeft: 3,

    flexDirection: 'row',
    justifyContent: 'space-between',
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
});
