import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import database from '../Database.js';
const db = database();

import Autocomplete from 'react-native-autocomplete-input';

export default class ErrorPOP2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }
  _okButton_clicked = () => {
    this.props.okEvent();
  };
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.containerItem}>
            <View style={styles.headerView}>
              <Text style={styles.headerTitle}>Thông Báo</Text>
            </View>
            <View style={styles.bodypu}>
                <Text style={styles.label}>Không thành công, vui lòng kiểm tra lại API</Text>
            </View>
            <View style={styles.viewBottomButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={this._okButton_clicked}>
                <Text style={styles.textButton}>Đóng</Text>
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
    alignItems: 'stretch',
    paddingHorizontal:5,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  containerItem: {
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  headerView: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ff5757',
    marginBottom:25
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonLogout: {
    width: 20,
    height: 20,
  },

  label: {
    fontSize: 17,
    fontWeight: '700',
    color:'#ff5757',
    textAlign:'center'
  },
  button: {
    backgroundColor:'#fff',
    elevation: 5,
    marginRight:10,
    marginBottom:3,
    width: 75,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderColor:'#ff5757',
    borderWidth:1,
    borderRadius:10
  },
  textButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  viewBottomButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    marginBottom: 5,
  },
  bodypu: {
    width: '100%',
    height: 90,
    justifyContent:'center',
    alignItems: 'center'
  }
});
