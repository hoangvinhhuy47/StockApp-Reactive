import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  BackHandler, 
  ToastAndroid,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import database from '../Database.js';
const db = database();
import ErrolPOP from '../popup/ErrolPOP.js';
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';

export default class FirstConfigVC extends Component {
  constructor(props) {
    super(props);

    //https://demobanhang.softwareviet.com/API/stock/
    //MTQ7VHJ1bmd0YW1QaHVjO0tCTF8xNDs2MzY4MDI5MTEzOTg2MzAwMDA=
    this.state = {
      webAPI: '',
      companyID: '',
      storeID: '',
      spinner: false,
      visibleError: false,
      visibleError2: false,
      visibleError3: false,
      visibleError4: false,
      errorDescription:'',
      exitApp: false,
    };

    this.deviceName = '';
    DeviceInfo.getDeviceName().then(deviceName => {
      this.deviceName = deviceName;
    });

    this.createDatabase();
  }
  backAction = () => {
    if(this.state.exitApp == false){
      this.setState({exitApp: true})
      ToastAndroid.show("Bấm lần nữa để thoát!", ToastAndroid.SHORT);
    }else if(this.state.exitApp == true){
      BackHandler.exitApp();
    }
    setTimeout(() => {
      this.setState({exitApp: false})
    }, 2000);
    return true;
  };
  componentDidMount() {
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  createDatabase = () => {
    db.initDB()
      .then(data => {})
      .catch(err => {});

    db.initDBStockTake()
      .then(data => {})
      .catch(err => {});

    db.initDBStockTakeProduct()
      .then(data => {})
      .catch(err => {
        Utils.showAlert(err);
      });

    db.initDBProduct()
      .then(data => {})
      .catch(err => {});
  };

  _okButton_click = async () => {
    Utils.dismissKeyboard();

    if (
      this.state.webAPI == '' ||
      this.state.companyID == '' ||
      this.state.storeID == ''
    ) {
      this.setState({visibleError: true})
      return;
    }

    let isValidUrl = Utils.validateURL(this.state.webAPI);
    if (!isValidUrl) {
      this.setState({visibleError2: true})
      return;
    }

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
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_event2 = () => {
    this.setState({visibleError2: false});
  };
  _popupOK_event3 = () => {
    this.setState({visibleError3: false});
  };
  _popupOK_event4 = () => {
    this.setState({visibleError4: false});
  };

  requestData = async (api, branch, store) => {
    let jsonDict = {
      SiteID: branch,
      StoreID: store,
      DeviceName: this.deviceName,
    };

    this.setState({spinner: true});

    let url = api + '/API/stock/SetingConfig';
    console.log('url string ' + url);
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonDict),
      timeout: 500,
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          spinner: false,
          errorDescription: responseJson.ErrorDescription,
        });

        if (responseJson.StatusID === 1) {
          let guiid = responseJson.GUID;
          let value = api + ';' + guiid;
          Utils.saveWebApi(value);

          let storeConfig = branch + ';' + store;
          Utils.saveStoreConfig(storeConfig);

          global.WebAPI = api;
          global.GUIID = guiid;

          this.props.doneConfig();
        } else {
          this.setState({visibleError4: true})
        }
      })
      .catch(error => {
        this.setState({spinner: false});
        this.setState({visibleError3: true})
      });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={Language.DDTT_CONFIG}
          okEvent={this._popupOK_event}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError2}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={Language.WEB_API_KHL}
          okEvent={this._popupOK_event2}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError3}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={Language.NOT_EXIST_API}
          okEvent={this._popupOK_event3}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError4}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={this.state.errorDescription}
          okEvent={this._popupOK_event4}
          />
          {/* </ModalContent> */}
        </Modal>
          <Spinner
            visible={this.state.spinner}
            textContent={'Đang tải...'}
            textStyle={{color: '#FFF'}}
          />
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.containerLogin}>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.WEB_API}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={'https://company.softwareviet.com'}
                  value={this.state.webAPI}
                  onChangeText={webAPI => this.setState({webAPI})}
                />
              </View>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.COMPANY}</Text>
                <TextInput
                  style={styles.textInput}
                  keyboardType={'numeric'}
                  placeholder={'ID công ty'}
                  value={this.state.companyID}
                  onChangeText={companyID => this.setState({companyID})}
                />
              </View>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.BRANCH}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={'Chi nhánh'}
                  value={this.state.storeID}
                  onChangeText={storeID => this.setState({storeID})}
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={this._okButton_click}>
                <Text style={styles.textButton}>{Language.OK}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          <Spinner
            visible={this.props.loading}
            textContent={this.props.label}
            textStyle={{color: '#FFF'}}
        />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#188FFC',
    alignItems: 'center',
  },
  containerLogin: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 150,
    width: '90%',
    paddingTop: 30,
    paddingBottom: 30,
    borderRadius: 10,
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
    paddingLeft: 5,
    borderRadius: 3,
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
