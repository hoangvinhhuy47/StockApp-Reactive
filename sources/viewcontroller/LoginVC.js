import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  BackHandler, 
  ToastAndroid,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import {UserModel} from '../models/UserModel.js';
import ErrolPOP from '../popup/ErrolPOP.js';

import Spinner from 'react-native-loading-spinner-overlay';

// ngocle, thudao, namnguyen/123456
export default class CheckVC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
      password: '',
      spinner: false,
      visibleError: false,
      visibleErrorEx: false,
      visibleError2: false,
      errorDescription:'',
      exitApp: false,
    };
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
    this._subscribe = this.props.navigation.addListener('focus', () => {
      this.setState({
        userName: '',
        password: '',
      });
    });
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  _loginButton_clicked = () => {
    Utils.dismissKeyboard();

    setTimeout(
      function() {
        this._requestLogin();
      }.bind(this),
      750,
    );
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_event2 = () => {
    this.setState({visibleError2: false});
  };

  _requestLogin = async () => {
    this.setState({spinner: true});
    let url = global.WebAPI + '/API/stock/CheckLogin?GUIID=' + global.GUIID;

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserName: this.state.userName,
        Password: this.state.password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        let status = responseJson.StatusID;
        if (status == 1) {
          let model = new UserModel();
          model.setData(responseJson.User);

          Utils.saveUserModel(model);
          global.UserModel = model;

          setTimeout(
            function() {
              this.setState({spinner: false});
            }.bind(this),
            500,
          );

          setTimeout(
            function() {
              // this.props.doneLogin();
              this.props.navigation.navigate('TabScreen');
            }.bind(this),
            750,
          );

          // this.props.doneLogin();
        } else {
          this.setState({spinner: false, visibleError: true, errorDescription:'Đăng nhập không thành công, Vui lòng kiểm tra lại'});
        }
      })
      .catch(error => {
        this.setState({spinner: false});
        this.setState({visibleError2: true})
      });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={this.state.errorDescription}
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
          ErrorDescription={Language.NOT_EXIST_API}
          okEvent={this._popupOK_event2}
          />
          {/* </ModalContent> */}
        </Modal>
          <Spinner
            visible={this.state.spinner}
            textContent={'Đang tải...'}
            textStyle={{color: '#FFF'}}
          />
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled>
            <View style={styles.containerLogin}>
              <Text style={styles.title}>{Language.LOGIN}</Text>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.USER_NAME}</Text>
                <TextInput
                  ref={$input => (this.$input = $input)}
                  style={styles.textInput}
                  value={this.state.userName}
                  onChangeText={userName => this.setState({userName})}
                />
              </View>
              <View style={styles.containerTextField}>
                <Text style={styles.label}>{Language.PASSWORD}</Text>
                <TextInput
                  ref={$input => (this.$input = $input)}
                  secureTextEntry={true}
                  style={styles.textInput}
                  value={this.state.password}
                  onChangeText={password => this.setState({password})}
                />
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={this._loginButton_clicked}>
                <Text style={styles.textButton}>{Language.LOGIN}</Text>
              </TouchableOpacity>
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
    paddingTop:10,
    backgroundColor: '#188FFC',
    justifyContent:'center'
  },
  containerLogin: {
    alignItems: 'center',
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding:10,
    marginHorizontal:5,
  },
  containerTextField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingRight: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 40,
    height: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    width: 130,
  },
  textInput: {
    width: 200,
    height: 30,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  button: {
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    width: 140,
    height: 45,
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
