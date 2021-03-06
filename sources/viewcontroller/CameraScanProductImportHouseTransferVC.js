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
  Button,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';
import database from '../Database.js';
const db = database();
console.log(db);

import AddNewProductScanPOP from '../popup/AddNewProductScanPOP.js';
import ErrolPOP from '../popup/ErrolPOP.js';
import ErrorPOP2 from '../popup/ErrorPOP2.js';
// import { StockTakeModel } from '../models/StockTakeModel.js';
import {ProductModel} from '../models/ProducModel.js';

import {CameraKitCameraScreen} from 'react-native-camera-kit';
import Sound from 'react-native-sound';

export default class CameraScanProductImportHouseTransferVC extends Component {
  constructor(props) {
    super(props);
    this.listProductScan = [],
    this.state = {
      qrvalue: '',
      opneScanner: false,
      visiblePopup: false,
      visibleError: false,
      visibleError2: false,
    };

    this.selectProduct = null;
    this.valueQR = '';
  }

  componentDidMount() {
    this.onOpneScanner();
  }
  _popupOK_event = () => {
    this.setState({visibleError: false});
    this.valueQR = '';
  };
  _popupOK_event2 = () => {
    this.setState({visibleError2: false});
    this.valueQR = '';
  };
  backButton_clicked = () => {
    this.props.navigation.navigate('AddNewWHouseImportTransfer', {
      itemScan: this.listProductScan,
    });
  };
  OkPopupEvent = item => {
    if (item) {
      if (item) {
        this.listProductScan.push(item);
      }
      this.setState({visiblePopup: false})
      this.valueQR = '';
    }
  };

  cancelPopupEvent = () => {
    this.valueQR = '';
    this.setState({visiblePopup: false});
  };

  onBarcodeScan(barCode) {
    //called after te successful scanning of QRCode/Barcode
    // this.setState({ qrvalue: qrvalue });
    // this.setState({ visiblePopup: true });

    //     C??ch t??nh tr???ng l?????ng khi qu??t barcode:
    // Khi qu??t barcode c?? chi???u d??i chu???i l?? 13, th?? c???t 7 k?? ?????u l?? M?? s???n ph???m. L???y 7 k?? t??? n??y t??m trong danh m???c s???n ph???m theo tr?????ng M?? S???n ph???m:
    //  - N???u t???n t???i s???n ph???m th?? l???y 5 k?? t??? cu???i chia cho 1000 th?? ra ???????c tr???ng l?????ng s???n ph???m
    //  - N???u kh??ng t???n t???i th?? t??m trong b???ng danh m???c s???n ph???m theo tr?????ng Barcode v???i 13 k?? t???
    // Barcode s???n ph???m c?? chi???u d??i t??? 7 ?????n 14 k?? t???

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
    this.valueQR = barCode;

    if (barCode.length === 13) {
      let code = barCode.slice(0, 7);

      db.getProductByCode(code)
        .then(data => {
          if (data !== null) {
            let last5 = barCode.slice(-5).slice(0, -1) + '0';
            let quantity = Number(last5) / 10000;

            this.selectProduct = data;
            this.selectProduct.Quantity = Utils.getValueWithNDecimal(
              quantity,
              3,
            );
            this.setState({visiblePopup: true});
          } else {
            db.getProductByBarCode(barCode)
              .then(data => {
                if (data === null) {
                  this.setState({visibleError: true});
                } else {
                  let newData = new ProductModel();
                  newData.setData(data);
                  newData.Quantity = '1';
                  this.selectProduct = newData;
                  this.setState({visiblePopup: true});
                }
              })
              .catch(err => {
                this.valueQR = '';
              });
          }
        })
        .catch(err => {
          this.valueQR = '';
        });
    } else {
      //search code product
      db.getProductByBarCode(barCode)
        .then(data => {
          if (data === null) {
            this.setState({visibleError: true});
          } else {
            this.selectProduct = data;
            this.setState({visiblePopup: true});
          }
        })
        .catch(err => {
          this.valueQR = '';
        });
    }
  }

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
          visible={this.state.visibleError}
          onTouchOutside={() => {}}>
          {/* <ModalContent> */}
          <ErrolPOP
            ErrorDescription={Language.PRODUCT_NOT_EXIST}
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
          <Text style={{color: '#fff', fontSize:16}}>????a m?? v??o trung t??m m??n h??nh</Text>
          <TouchableOpacity style={styles.ButtonDong}
          onPress={this.backButton_clicked}>
              <Text style={{color: '#fff', fontSize:16}}>????ng</Text>
          </TouchableOpacity>
        </View>
        <Modal
          width={0.9}
          visible={this.state.visiblePopup}
          onTouchOutside={() => {}}>
          <AddNewProductScanPOP
            selectedProduct={this.selectProduct}
            isTransfer={true}
            hidePopupEvent={this.cancelPopupEvent}
            successPopupEvent={this.OkPopupEvent}
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
    borderRadius:15,
    borderWidth:1,
    paddingHorizontal:20,
    paddingVertical:3,
    marginTop:35,
    marginBottom:10
  }
});
