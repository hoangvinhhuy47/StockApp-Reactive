import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Modal,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import database from '../Database.js';
const db = database();
import SuccessPOP from '../popup/SuccessPOP.js';

import DeviceInfo from 'react-native-device-info';
import axios from 'axios';

export default class SettingDetailVC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webAPI: global.WebAPI,
      companyID: '',
      storeID: '',
      visibleSuccess: false,
    };

    this.deviceName = '';
    DeviceInfo.getDeviceName().then(deviceName => {
      this.deviceName = deviceName;
    });
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('focus', () => {
      this._getStockConfig();
    });
  }
  _popupOK_eventSuccess = () => {
    this.setState({visibleSuccess: false});
    Utils.saveUserModel(null);
    this.props.navigation.navigate('LoginVC');
  };

  _getStockConfig = async () => {
    Utils.getStoreConfig()
      .then(res => {
        if (res !== null) {
          let config = res.split(';');
          this.setState({
            companyID: config[0],
            storeID: config[1],
          });
        }
      })
      .catch(err => alert(err));
  };

  _logOut_click = async () => {
    Utils.saveUserModel(null);
    this.props.navigation.navigate('LoginVC');
  };

  _cancelButton_click = () => {
    this.props.navigation.pop();
  };

  _okButton_click = async () => {
    Utils.dismissKeyboard();

    if (
      this.state.webAPI == '' ||
      this.state.companyID == '' ||
      this.state.storeID == ''
    ) {
      Utils.showAlert('Nhập đầy đủ thông tin!');
      return;
    }

    let isValidUrl = Utils.validateURL(this.state.webAPI);
    if (!isValidUrl) {
      Utils.showAlert('WebAPI không hợp lệ');
      return;
    }

    db.deleteStock().then(result => {
      db.deleteProduct().then(() => {
        db.deleteAllStockTake().then(() => {
          db.deleteAllStockTakeProduct().then(() => {
            let lastLetter = this.state.webAPI[this.state.webAPI.length - 1];

            let newAPI = this.state.webAPI.trim().toLowerCase();
            if (lastLetter === '/') {
              newAPI = newAPI.substring(0, newAPI.length - 1);
            } else {
            }

            this.requestData(
              newAPI,
              this.state.companyID.trim(),
              this.state.storeID.trim(),
            );
          });
        });
      });
    });
  };

  requestData = async (api, branch, store) => {
    let jsonDict = {
      SiteID: branch,
      StoreID: store,
      DeviceName: this.deviceName,
    };
    console.log(jsonDict);
    const _api = axios.create({
      headers: {
        'Content-Type': 'application/json',
      },
      baseURL: api
    });
    
    _api.post('/API/stock/SetingConfig', jsonDict)
    .then(responseJson => {
      if (responseJson.status == 200) {
        let data = responseJson.data;
        let status = data.StatusID;
        this.setState({errorDescription: data.ErrorDescription});
        if (status == 1) {
          let guiid = data.GUID;
          let value = api + ';' + guiid;
          Utils.saveWebApi(value);

          let storeConfig = branch + ';' + store;
          Utils.saveStoreConfig(storeConfig);

          global.WebAPI = api;
          global.GUIID = guiid;
          this.setState({visibleSuccess:true})
        } else {
          Utils.showAlert(data.ErrorDescription);
        }
      }else
      Utils.showAlert('Có lỗi xảy ra. Vui lòng kiểm tra lại WebAPI1234!');
      })
      .catch(error => {
        Utils.showAlert('Có lỗi xảy ra. Vui lòng kiểm tra lại WebAPI!' + error);
        // this._hideLoading()
      });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.visibleSuccess}
            onTouchOutside={() => {}}>
            {/* <ModalContent> */}
            <SuccessPOP
              ErrorDescription={Language.CHANGE_SETTING_SUCCESS}
              okEvent={this._popupOK_eventSuccess}
            />
            {/* </ModalContent> */}
          </Modal>
          <View style={styles.headerView}>
            <View style={styles.viewAvatar}>
              <Image
                style={styles.avatarImage}
                source={require('../resources/avatar.png')}
              />
              <Text style={styles.headerTitle}>Nhân viên kho 1</Text>
            </View>
            <TouchableOpacity onPress={this._logOut_click}>
              <Image
                style={styles.headerRightButton}
                source={require('../resources/logout.png')}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.containerLogin}>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.WEB_API}</Text>
                <TextInput
                  style={styles.textInput}
                  value={this.state.webAPI}
                  onChangeText={webAPI => this.setState({webAPI})}
                />
              </View>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.COMPANY}</Text>
                <TextInput
                  style={styles.textInput}
                  value={this.state.companyID}
                  onChangeText={companyID => this.setState({companyID})}
                />
              </View>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.BRANCH}</Text>
                <TextInput
                  style={styles.textInput}
                  value={this.state.storeID}
                  onChangeText={storeID => this.setState({storeID})}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  width: '100%',
                }}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this._cancelButton_click}>
                  <Text style={styles.textButton}>{Language.CANCEL}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={this._okButton_click}>
                  <Text style={styles.textButton}>{Language.OK}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerView: {
    width: '100%',
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#5EB45F',
    justifyContent: 'space-between',
    zIndex: 999,
    backgroundColor: 'white',
  },
  viewAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },
  avatarImage: {
    width: 35,
    height: 35,
    marginLeft: 10,
  },
  headerRightButton: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  containerLogin: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTextField: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    height: 60,
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    color: 'blue',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 40,
    height: 30,
  },
  label: {
    fontSize: 18,
    width: 120,
    fontWeight: '500',
  },
  textInput: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 0.5,
    flex: 1,
    borderRadius: 3,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    width: 140,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
