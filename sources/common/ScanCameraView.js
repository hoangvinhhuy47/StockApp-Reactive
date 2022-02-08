// import {CameraKitCameraScreen} from 'react-native-camera-kit';
// import Sound from 'react-native-sound';

// const onBarcodeScan = (barCode) => {
//     //called after te successful scanning of QRCode/Barcode
//     // this.setState({ qrvalue: qrvalue });
//     // this.setState({ visiblePopup: true });

//     //     Cách tính trọng lượng khi quét barcode:
//     // Khi quét barcode có chiều dài chuổi là 13, thì cắt 7 ký đầu là Mã sản phẩm. Lấy 7 ký tự này tìm trong danh mục sản phẩm theo trường Mã Sản phẩm:
//     //  - Nếu tồn tại sản phẩm thì lấy 5 ký tự cuối chia cho 1000 thì ra được trọng lượng sản phẩm
//     //  - Nếu không tồn tại thì tìm trong bảng danh mục sản phẩm theo trường Barcode với 13 ký tự
//     // Barcode sản phẩm có chiều dài từ 7 đến 14 ký tự

//     Sound.setCategory('Playback');
//     var whoosh = new Sound('bip.mp3', Sound.MAIN_BUNDLE, error => {
//       if (error) {
//         console.log('failed to load the sound', error);
//         return;
//       }
//       whoosh.setVolume(1);
//       // Play the sound with an onEnd callback
//       whoosh.play();
//     });
//   }
//   const onOpneScanner = ()=> {
//     var that = this;
//     //To Start Scanning
//     if (Platform.OS === 'android') {
//       async function requestCameraPermission() {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'CameraExample App Camera Permission',
//               message: 'CameraExample App needs access to your camera ',
//             },
//           );
//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             //If CAMERA Permission is granted
//             that.setState({qrvalue: ''});
//             that.setState({opneScanner: true});
//           } else {
//             Utils.showAlert(Language.CAMERA_PERMISSION_DENIED);
//           }
//         } catch (err) {
//           Utils.showAlert(Language.CAMERA_PERMISSION_ERROR, err);
//           console.warn(err);
//         }
//       }
//       //Calling the camera permission function
//       requestCameraPermission();
//     } else {
//       that.setState({opneScanner: true});
//     }
//   }
// export const main = () => {
//     useEffect(() => {
//         onOpneScanner()
//     })
//   return (
//     <CameraKitCameraScreen
//       showFrame={true}
//       //Show/hide scan frame
//       scanBarcode={true}
//       //Can restrict for the QR Code only
//       laserColor={'#5cb85c'}
//       //Color can be of your choice
//       frameColor={'white'}
//       //If frame is visible then frame color
//       colorForScannerFrame={'black'}
//       //Scanner Frame color
//       onReadCode={event =>
//         on
//       }
//     />
//   );
// };
