/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Alert,
  Modal,
  Text,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';
import database from '../Database.js';
import ErrolPOP from '../popup/ErrolPOP.js';
import ErrorPOP2 from '../popup/ErrorPOP2.js';
import SuccessPOP from '../popup/SuccessPOP.js';

const db = database();
console.log(db);

import AddNewProductScanPOP from '../popup/AddNewProductScanPOP.js';
import axios from 'axios';
import {CameraKitCameraScreen} from 'react-native-camera-kit';
import Sound from 'react-native-sound';

export default class CheckOutWarehouseVC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qrvalue: '',
      opneScanner: false,
      visiblePopup: false,
      loading: false,
      visibleError: false,
      visibleError2: false,
      visibleSuccess: false,
      errorDescription: '',
    };
    this.selectProduct = null;
    this.valueQR = '';
  }

  componentDidMount() {
    this.onOpneScanner();
  }

  backButton_clicked = () => {
    this.props.navigation.goBack();
  };

  cancelPopupEvent = () => {
    this.valueQR = '';
    this.setState({visiblePopup: false});
  };
  _popupOK_event2 = () => {
    this.valueQR = '';
    this.setState({visibleError2: false});
  };
  _popupOK_eventSuccess = () => {
    this.setState({visibleSuccess: false});
    this.valueQR = '';
  };

  onBarcodeScan(barCode) {
    if (this.valueQR !== '') {
      return;
    }
    Sound.setCategory('Playback');
    var whoosh = new Sound('bip.mp3', Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      whoosh.setVolume(1);
      // Play the sound with an onEnd callback
      whoosh.play();
    });

    //whoosh.play();

    this.valueQR = barCode;
    let body = {
      UserID: global.UserModel.UserID,
      Code: this.valueQR,
    };
    let url =
      global.WebAPI + '/API/stock/ReleaseSaleInvoice?GUIID=' + global.GUIID;
    axios
      .post(url, body)
      .then(response => {
        if (response.status == 200) {
          let data = response.data;
          let status = data.StatusID;
          this.setState({
            loading: false,
            errorDescription: data.ErrorDescription,
          });
          if (status == 1) {
            this.setState({visibleSuccess: true});
          } else {
            if (data.ErrorCode == 'User_not_found') {
              Utils.saveUserModel(null);
              this.props.navigation.navigate('LoginVC');
            } else {
              this.setState({visibleError: true});
            }
          }
        }
      })
      .catch(error => {
        this.setState({loading: false});
        this.setState({visibleError2: true});
        console.log('errror', error.response);
      });
  }
  _popupOK_event = () => {
    this.setState({visibleError: false});
    this.valueQR = '';
  };

  onOpneScanner() {
    var that = this;
    //To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'CameraExample App Camera Permission',
              message: 'CameraExample App needs access to your camera ',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //If CAMERA Permission is granted
            that.setState({qrvalue: ''});
            that.setState({opneScanner: true});
          } else {
            Utils.showAlert(Language.CAMERA_PERMISSION_DENIED);
          }
        } catch (err) {
          Utils.showAlert(Language.CAMERA_PERMISSION_ERROR, err);
          console.warn(err);
        }
      }
      //Calling the camera permission function
      requestCameraPermission();
    } else {
      that.setState({opneScanner: true});
    }
  }
  render() {
    //If qrvalue is set then return this view
    if (!this.state.opneScanner) {
      return null;
    }
    return (
      <View style={{flex: 1}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleSuccess}
          onTouchOutside={() => {}}>
          {/* <ModalContent> */}
          <SuccessPOP
            ErrorDescription={Language.CREATE_UPDATE_WARE_SUCCESS}
            okEvent={this._popupOK_eventSuccess}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError}
          onTouchOutside={() => {}}>
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
          onTouchOutside={() => {}}>
          {/* <ModalContent> */}
          <ErrorPOP2 okEvent={this._popupOK_event2} />
          {/* </ModalContent> */}
        </Modal>
        <Spinner
          visible={this.state.loading}
          textContent={'Đã quét được barcode, vui lòng đợi...'}
          textStyle={{color: '#FFF'}}
        />
        <CameraKitCameraScreen
          showFrame={true}
          //Show/hide scan frame
          scanBarcode={true}
          //Can restrict for the QR Code only
          laserColor={'#5cb85c'}
          //Color can be of your choice
          frameColor={'white'}
          //If frame is visible then frame color
          colorForScannerFrame={'black'}
          //Scanner Frame color
          onReadCode={event =>
            this.onBarcodeScan(event.nativeEvent.codeStringValue)
          }
        />
        <View style={styles.itemNote}>
          <Text style={{color: '#fff', fontSize: 16}}>
            Đưa mã vào trung tâm màn hình
          </Text>
          <TouchableOpacity
            style={styles.ButtonDong}
            onPress={this.backButton_clicked}>
            <Text style={{color: '#fff', fontSize: 16}}>Đóng</Text>
          </TouchableOpacity>
        </View>
        <Modal
          width={0.9}
          visible={this.state.visiblePopup}
          onTouchOutside={() => {
            // this.setState({ visiblePopup: false });
          }}>
          <AddNewProductScanPOP
            selectedProduct={this.selectProduct}
            stockTakeID={this.stockTakeID}
            hidePopupEvent={this.cancelPopupEvent}
          />
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2c3539',
    padding: 10,
    width: 300,
    marginTop: 16,
  },
  heading: {
    color: 'black',
    fontSize: 24,
    alignSelf: 'center',
    padding: 10,
    marginTop: 30,
  },
  simpleText: {
    color: 'black',
    fontSize: 20,
    alignSelf: 'center',
    padding: 10,
    marginTop: 16,
  },
  headerRightButton: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  itemNote: {
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonDong: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 3,
    marginTop: 35,
    marginBottom: 10,
  },
});
