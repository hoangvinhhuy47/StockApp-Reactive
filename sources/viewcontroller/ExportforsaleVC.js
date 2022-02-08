import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler, 
  ToastAndroid,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';
import database from '../Database.js';
const db = database();

import Spinner from 'react-native-loading-spinner-overlay';

export default class ExportforsaleVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
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
  _checkyourorder_click = async () => {
    this.props.navigation.push('CheckYourOrderVC', {
      checkForm: null,
    });
    return;
  };
  _checkOutWarehouse_click = async () => {
    this.props.navigation.push('CheckOutWarehouseVC', {
      checkForm: null,
    });
    return;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
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
        <View style={styles.containerButon}>
          <TouchableOpacity onPress={this._checkyourorder_click}>
            <View style={styles.backgroudButton}>
              <Image
                style={styles.ImageBT}
                source={require('../resources/Capture.png')}
              />
              <Text style={styles.textButton}>Kiểm đơn đặt hàng</Text>
              <Image
                style={styles.ImageBT2}
                source={require('../resources/right.png')}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._checkOutWarehouse_click}>
            <View style={styles.backgroudButton}>
              <Image
                style={styles.ImageBT3}
                source={require('../resources/Capture2.png')}
              />
              <Text style={styles.textButton}>Kiểm phiếu xuất kho</Text>
              <Image
                style={styles.ImageBT2}
                source={require('../resources/right.png')}
              />
            </View>
          </TouchableOpacity>
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
  containerButon: {
    height: '90%',
    width: '100%',
    justifyContent: 'flex-start',
    marginTop: 30,
  },
  textButton: {
    color: '#000',
    fontSize: 20,
  },
  backgroudButton: {
    marginBottom: 20,
    height: 80,
    width: '95%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    elevation: 5,
    borderRadius: 4,
  },
  ImageBT: {
    height: 35,
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
});
