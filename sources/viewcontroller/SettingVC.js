import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  BackHandler, 
  ToastAndroid,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import database from '../Database.js';
const db = database();

import {StockModel} from '../models/StockModel.js';
import {ProductModel} from '../models/ProducModel.js';

import Spinner from 'react-native-loading-spinner-overlay';
import SuccessPOP from '../popup/SuccessPOP.js';
import CodePush from 'react-native-code-push';

export default class SettingVC extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spinner: false,
      visibleSuccess: false,
      visibleSuccess2: false,
      version: "1.0.0",
      exitApp: false,
    };

    this.totalRow = 0;
    this.arrayProduct = [];
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
      this.totalRow = 0;
      this.arrayProduct = [];
    });
    CodePush.getUpdateMetadata().then(metadata => {
      this.setState({
        version: metadata.appVersion + '.' + metadata.label.substring(1)
      })
    })
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  _logOut_click = async () => {
    Utils.saveUserModel(null);
    this.props.navigation.navigate('LoginVC');
  };

  _listProduct_click = () => {
    db.deleteProduct()
      .then(result => {
        this.requestDataListProduct(1);
      })
      .catch(err => {});
  };

  _listStock_click = () => {
    db.deleteStock()
      .then(result => {
        this.requestDataListStock();
      })
      .catch(err => {});
  };

  _setting_click = () => {
    this.props.navigation.push('SettingDetailVC');
  };

  requestDataListProduct = index => {
    this._showLoading();

    let numItems = (index - 1) * 300;
    if (this.totalRow != 0 && numItems > this.totalRow) {
      this.insertListProduct(this.arrayProduct);
      return;
    }

    let url =
      global.WebAPI +
      '/API/stock/GetProductList?GUIID=' +
      global.GUIID +
      '&pageIndex=' +
      index;
    console.log('url request ' + url);
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        this.totalRow = responseJson.TotalRow;

        for (let dict of responseJson.ProductList) {
          let model = new ProductModel();
          model.setData(dict);
          this.arrayProduct.push(model);
        }

        this.requestDataListProduct(index + 1);
      })
      .catch(error => {
        this._hideLoading();
        Utils.showAlert('Có lỗi xảy ra. Vui lòng kiểm tra lại WebAPI!');
      });
  };

  requestDataListStock = async () => {
    this._showLoading();

    let url =
      global.WebAPI +
      '/API/stock/GetStockList?GUIID=' +
      global.GUIID +
      '&appid=1';
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        let array = [];
        for (let dict of responseJson.StockList) {
          let model = new StockModel();
          model.setData(dict);
          array.push(model);
        }

        this.insertListStock(array);
      })
      .catch(error => {
        this._hideLoading();
        Utils.showAlert('Có lỗi xảy ra. Vui lòng kiểm tra lại WebAPI!');
      });
  };

  insertListStock = async model => {
    db.addListStock(model)
      .then(result => {
        this._hideLoading();

        let dateString = Utils.getDayMonthYearString(new Date());
        Utils.saveSyncDate(dateString);

        this.setState({visibleSuccess: true});
      })
      .catch(err => {
        this._hideLoading();
      });
  };

  insertListProduct = array => {
    let length = array.length;

    if (length == 0) {
      this._hideLoading();
      this.setState({visibleSuccess2: true});
      return;
    }

    let newArray = array.splice(0, 30);
    db.addListProduct(newArray)
      .then(result => {
        this.insertListProduct(array);
      })
      .catch(err => {
        // alert(err)
        this._hideLoading();
      });

    // db.addListProduct(list).then((result) => {
    // this._hideLoading()
    // setTimeout(function () {
    //   Utils.showAlert(Language.SYNC_PRODUCT_SUCCESS + ' ');

    // }, 500);
    // }).catch((err) => {
    //   // alert(err)
    //   this._hideLoading()
    // })
  };

  _insertProductToDatabase = array => {
    let length = array.length;

    if (length == 0) {
      this._hideLoading();
      this.setState({visibleSuccess2: true})
      return;
    }

    while (length > 0) {
      let newArray = array.splice(0, 30);
      db.addListProduct(list)
        .then(result => {})
        .catch(err => {
          // alert(err)
          this._hideLoading();
        });
    }

    // db.addListProduct(list).then((result) => {
    //   this._insertProductToDatabase(total);
    // }).catch((err) => {
    //   // alert(err)
    //   this._hideLoading()
    // })
  };
  _popupOK_eventPop = () => {
    this.setState({visibleSuccess: false});
  };
  _popupOK_eventPop2 = () => {
    this.setState({visibleSuccess2: false});
  };

  _showLoading = () => {
    this.setState({spinner: true});
  };

  _hideLoading = () => {
    this.setState({spinner: false});
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleSuccess}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <SuccessPOP
          ErrorDescription={Language.SYNC_STOCK_SUCCESS}
          okEvent={this._popupOK_eventPop}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleSuccess2}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <SuccessPOP
          ErrorDescription={Language.SYNC_PRODUCT_SUCCESS}
          okEvent={this._popupOK_eventPop2}
          />
          {/* </ModalContent> */}
        </Modal>
        <Spinner
          visible={this.state.spinner}
          textContent={'Đang tải...'}
          textStyle={{color: '#FFF'}}
        />
        <View style={styles.headerView}>
          <View style={styles.viewAvatar}>
            <Image
              style={styles.avatarImage}
              source={require('../resources/avatar.png')}
            />
            <Text style={styles.headerTitle}>{global.UserModel.FullName}</Text>
          </View>
          <TouchableOpacity onPress={this._logOut_click}>
            <Image
              style={styles.headerRightButton}
              source={require('../resources/logout.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text style={[styles.subTitleText, {marginTop: 10, marginBottom:10}]}>
            {Language.DOWNLOAD_CATEGORY}
          </Text>
          <TouchableOpacity onPress={this._listProduct_click}>
            <View style={styles.backgroudButton}>
              <Image
                style={styles.ImageBT}
                source={require('../resources/goods.png')}
              />
              <Text style={styles.textButton}>{Language.LIST_PRODUCT}</Text>
              <Image
                style={styles.ImageBT2}
                source={require('../resources/right.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._listStock_click}>
            <View style={styles.backgroudButton}>
              <Image
                style={styles.ImageBT}
                source={require('../resources/warehouse_1.png')}
              />
              <Text style={styles.textButton}>{Language.LIST_STOCK}</Text>
              <Image
                style={styles.ImageBT2}
                source={require('../resources/right.png')}
              />
            </View>
          </TouchableOpacity>
          <Text style={[styles.subTitleText, {marginTop: 10, marginBottom:10}]}>
            {Language.SETTING}
          </Text>
          <TouchableOpacity onPress={this._setting_click}>
            <View style={styles.backgroudButton}>
              <Image
                style={styles.ImageBT}
                source={require('../resources/setting.png')}
              />
              <Text style={styles.textButton}>{Language.CHANGE_SETTING}</Text>
              <Image
                style={styles.ImageBT2}
                source={require('../resources/right.png')}
              />
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={{justifyContent:'center', flexDirection:'row', paddingBottom:5}}>
          <Text style={styles.txtversion}>Version: </Text>
          <Text style={styles.txtversion}>{this.state.version}</Text>
        </View>
      </SafeAreaView>
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
  subTitleText: {
    fontSize: 19,
    fontWeight: '600',
    marginLeft: 15,
  },
  buttonTitle: {
    marginLeft: 25,
    fontSize: 18,
  },
  backgroudButton: {
    marginBottom: 10,
    height: 50,
    width: '95%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    elevation: 5,
    borderRadius: 4,
    paddingHorizontal: 25,
  },
  ImageBT: {
    height: 30,
    width: 30,
  },
  ImageBT3: {
    height: 45,
    width: 35,
  },
  ImageBT2: {
    height: 20,
    width: 20,
  },
  textButton: {
    color: '#000',
    fontSize: 17,
  },
  txtversion: {
    color:'gray',
    fontSize: 13,
    fontStyle:'italic',
  }
});
