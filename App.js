/**

* Sample React Native App

* https://github.com/facebook/react-native

*

* @format

* @flow

*/

import React, {Component} from 'react';

import {Image, StyleSheet, Alert, Text} from 'react-native';

import {NavigationContainer, useNavigation} from '@react-navigation/native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {createStackNavigator} from '@react-navigation/stack';

import CheckVC from './sources/viewcontroller/CheckVC.js';

import RequestTransportVC from './sources/viewcontroller/RequestTransportVC.js';

import WHouseImportTransferVC from './sources/viewcontroller/WHouseImportTransferVC.js';

import WHousetransferVC from './sources/viewcontroller/WHousetransferVC.js';
import AddNewWHouseTransfer from './sources/viewcontroller/AddNewWHouseTransfer.js';
import CameraAddNewProductHouseTranferVC from './sources/viewcontroller/CameraAddNewProductHouseTranferVC.js';
import AddNewWHouseImportTransfer from './sources/viewcontroller/AddNewWHouseImportTransfer.js';
import CameraScanOutTransfer from './sources/viewcontroller/CameraScanOutTransfer.js';
import CameraScanProductImportHouseTransferVC from './sources/viewcontroller/CameraScanProductImportHouseTransferVC.js';

import ExportforsaleVC from './sources/viewcontroller/ExportforsaleVC.js';

import SettingVC from './sources/viewcontroller/SettingVC.js';

import CheckYourOrderVC from './sources/viewcontroller/CheckYourOrderVC';

import CheckOrderDetail from './sources/viewcontroller/CheckOrderDetail';

import CheckOutWarehouseVC from './sources/viewcontroller/CheckOutWarehouseVC';

import NewRequestCheckFormVC from './sources/viewcontroller/NewRequestCheckFormVC.js';

import RequestCheckFormDetail from './sources/viewcontroller/RequestCheckFormDetail.js';

import FirstConfigVC from './sources/viewcontroller/FirstConfigVC.js';

import LoginVC from './sources/viewcontroller/LoginVC.js';

import CameraVC from './sources/viewcontroller/CameraVC.js';

import CameraCheckOrderVC from './sources/viewcontroller/CameraCheckOrderVC.js';

import SettingDetailVC from './sources/viewcontroller/SettingDetailVC.js';

import Language from './sources/resources/Language.js';

import Utils from './sources/common/Utils.js';

import Spinner from 'react-native-loading-spinner-overlay';

import CodePush from 'react-native-code-push';

function isCameraVC(route) {
  if (route['state'] !== undefined) {
    if (route.state['routes'] !== undefined) {
      for (let dict of route.state.routes) {
        if (dict.name === 'CameraVC') {
          return true;
        }
      }
    }
  }

  return false;
}

//for check stack

const CheckStack = createStackNavigator();

function CheckStackScreen({route}) {
  const navigation = useNavigation();

  navigation.addListener('tabPress', e => {
    navigation.navigate('CheckVC');
  });

  let isCamera = isCameraVC(route);

  if (isCamera) {
    navigation.setOptions({tabBarVisible: false});
  } else {
    navigation.setOptions({tabBarVisible: true});
  }

  return (
    <CheckStack.Navigator
      screenOptions={{headerShown: false}}
      mode={isCamera ? 'modal' : null}>
      <CheckStack.Screen name="CheckVC" component={CheckVC} />
      <CheckStack.Screen
        name="NewRequestCheckFormVC"
        component={NewRequestCheckFormVC}
      />
      <CheckStack.Screen
        name="RequestCheckFormDetail"
        component={RequestCheckFormDetail}
      />
      <CheckStack.Screen name="CameraVC" component={CameraVC} />
    </CheckStack.Navigator>
  );
}

//for Exportforsale stack

const ExportforsaleStack = createStackNavigator();

function ExportforsaleStackScreen() {
  const navigation = useNavigation();

  navigation.addListener('tabPress', e => {
    navigation.navigate('ExportforsaleVC');
  });

  return (
    <ExportforsaleStack.Navigator screenOptions={{headerShown: false}}>
      <ExportforsaleStack.Screen
        name="ExportforsaleVC"
        component={ExportforsaleVC}
      />

      <ExportforsaleStack.Screen
        name="CheckYourOrderVC"
        component={CheckYourOrderVC}
      />

      <ExportforsaleStack.Screen
        name="CheckOutWarehouseVC"
        component={CheckOutWarehouseVC}
      />

      <ExportforsaleStack.Screen
        name="CheckOrderDetail"
        component={CheckOrderDetail}
      />

      <ExportforsaleStack.Screen
        name="CameraCheckOrderVC"
        component={CameraCheckOrderVC}
      />
    </ExportforsaleStack.Navigator>
  );
}

//for RequestTransport stack
const RequestTransportVCStack = createStackNavigator();

function RequestTransportVCStackScreen() {
  const navigation = useNavigation();

  navigation.addListener('tabPress', e => {
    navigation.navigate('RequestTransportVC');
  });
  return(
    <RequestTransportVCStack.Navigator screenOptions={{headerShown:false}}>
      <RequestTransportVCStack.Screen name="RequestTransportVC" component={RequestTransportVC}/>
      <RequestTransportVCStack.Screen name="WHouseImportTransferVC" component={WHouseImportTransferVC}/>
      <RequestTransportVCStack.Screen name="WHousetransferVC" component={WHousetransferVC}/>
      <RequestTransportVCStack.Screen name="AddNewWHouseTransfer" component={AddNewWHouseTransfer}/>
      <RequestTransportVCStack.Screen name="CameraAddNewProductHouseTranferVC" component={CameraAddNewProductHouseTranferVC} />
      <RequestTransportVCStack.Screen name="AddNewWHouseImportTransfer" component={AddNewWHouseImportTransfer}/>
      <RequestTransportVCStack.Screen name="CameraScanOutTransfer" component={CameraScanOutTransfer}/>
      <RequestTransportVCStack.Screen name="CameraScanProductImportHouseTransferVC" component={CameraScanProductImportHouseTransferVC}/>

    </RequestTransportVCStack.Navigator>
  );
}

//for setting stack

const SettingStack = createStackNavigator();

function SettingStackScreen() {
  const navigation = useNavigation();

  navigation.addListener('tabPress', e => {
    navigation.navigate('SettingVC');
  });

  return (
    <SettingStack.Navigator screenOptions={{headerShown: false}}>
      <SettingStack.Screen name="SettingVC" component={SettingVC} />
      <SettingStack.Screen name="SettingDetailVC" component={SettingDetailVC} />
    </SettingStack.Navigator>
  );
}

//for tabbar

const Tab = createBottomTabNavigator();

function TabScreen() {
  // const myIcon = ;

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={Language.EXPORT_SALE}
        component={ExportforsaleStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={require('./sources/resources/sell.png')}
              style={[styles.tabbarIcon, {tintColor: color}]}
            />
          ),
        }}
      />

      <Tab.Screen
        name={Language.REQUEST_TRANSPORT}
        component={RequestTransportVCStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={require('./sources/resources/Requestt.png')}
              style={[styles.tabbarIcon, {tintColor: color}]}
            />
          ),
        }}
      />

      <Tab.Screen
        name={Language.CHECK_STOCK}
        component={CheckStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={require('./sources/resources/warehouse.png')}
              style={[styles.tabbarIcon, {tintColor: color}]}
            />
          ),
        }}
      />

      <Tab.Screen
        name={Language.SETTING}
        component={SettingStackScreen}
        options={{
          tabBarIcon: ({color}) => (
            <Image
              source={require('./sources/resources/tune.png')}
              style={[styles.tabbarIcon, {tintColor: color}]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const RootStack = createStackNavigator();

//status == 0 //loading page

//status == 1 // not config; not login

//status == 2 // done confog; not login

//statius == 3 // done all

class App extends Component {
  constructor(props) {
    super(props);
    global.WebAPI = '';
    global.GUIID = '';
    global.UserModel = null;
    this.state = {
      status: 0,
      loading: false,
      version: '1.0.0',
      label: ''
    };
  }

  codePushStatusDidChange = syncStatus => {
    console.log('syncStatus', syncStatus);

    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        this.setState({label: 'Đang kiểm tra cập nhật phiên bản'});
        break;

      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        this.setState({label: 'Đang tải dữ liệu phiên bản mới', loading: true});
        break;

      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        this.setState({label: 'Đang đợi người dùng xác nhận', loading: false});
        break;

      case CodePush.SyncStatus.INSTALLING_UPDATE:
        this.setState({label: 'Đang cài đặt', loading: true});
        break;

      case CodePush.SyncStatus.UP_TO_DATE:
        CodePush.getUpdateMetadata().then(metadata => {
          this.setState({
            label: 'Bản cài đặt mới nhất: ' + metadata.appVersion+"|"+metadata.label,
            loading: false,
            version: metadata.appVersion + metadata.label.substring(1)
          });
        });

        break;
      case CodePush.SyncStatus.UPDATE_IGNORED:
        this.setState({label: 'update cancelled by user.', loading: false});
        break;

      case CodePush.SyncStatus.UPDATE_INSTALLED:
        this.setState({label: 'Đang cài đặt và khởi động lại', loading: false});

        setTimeout(() => {
          CodePush.restartApp();
          this.setState({loading: false});
        }, 1000);
        break;

      case CodePush.SyncStatus.UNKNOWN_ERROR:
        this.setState({label: 'Có lỗi xảy ra', loading: false});
        break;

      default:
        CodePush.getUpdateMetadata().then(metadata => {
          this.setState({
            label: 'Bản cài đặt mới nhất: ' + metadata.appVersion+"|"+metadata.label,
            loading: false,
            version: metadata.appVersion + metadata.label.substring(1)
          });
        });
        break;
    }
  };

  componentDidMount() {
    this._checkCongigAndLogin();
    CodePush.sync(
      {
        // deploymentKey: 'ntRayFvLtKqZws3VT3AInxpgsBsnq1yIgK-te8',//key Staging android
        deploymentKey:'gIc0zlizIGFiu4VudEC--qflWyCqEIjfoXkLf',//key Production android
        // deploymentKey:'eOOmpdMXDkp250N5OIGUUrfF1jic_IhnaoulV',//key Staging ios
        // deploymentKey:'vq7ZLap7e2AIQqza9a-qNsD9idRwdk56_ZAdu',//key Production ios
      },
      this.codePushStatusDidChange,
      null,
    );
    this.setState({loading: false});
  }

  _checkCongigAndLogin = async () => {
    Utils.getWebApi()

      .then(res => {
        if (res !== null) {
          //set WebApi and GUIID
          let apiGUIID = res.split(';');
          global.WebAPI = apiGUIID[0];
          global.GUIID = apiGUIID[1];
          
          global.isDev = true;
          
          //check is login
          Utils.getUserModel()
            .then(res => {
              if (res !== null) {
                global.UserModel = res;
              }
              this.setState({status: 2});
            })

            .catch(err => Utils.showAlert(err));
        } else {
          this.setState({status: 1});
        }
        // console.log(res)
      })

      .catch(err => Utils.showAlert(err));
  };

  _doneConfig_event = () => {
    this.setState({status: 2});
  };

  render() {
    if (this.state.status == 0) {
      return null;
    } else if (this.state.status == 1) {
      return (
        <FirstConfigVC
          doneConfig={this._doneConfig_event}
          label={this.state.label}
          loading={this.state.loading}
        />
      );
    }
    let isSignIn = global.UserModel != null ? true : false;

    return (
      <NavigationContainer>
        <RootStack.Navigator 
          initialRouteName={!isSignIn ? 'LoginVC' : 'TabScreen'}
          screenOptions={{headerShown: false}}>
          <RootStack.Screen name="LoginVC" component={LoginVC} />
          <RootStack.Screen name="TabScreen" component={TabScreen} />
        </RootStack.Navigator>
        <Spinner
          visible={this.state.loading}
          textContent={this.state.label}
          textStyle={{color: '#FFF'}}
        />
        {/* <Text style={{position: 'absolute', bottom: 1, right: 1}}>{this.state.label}</Text> */}
      </NavigationContainer>
    );
  }
}

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
  installMode: CodePush.InstallMode.IMMEDIATE,
};
export default CodePush(codePushOptions)(App);
// export default App
const styles = StyleSheet.create({
  tabbarIcon: {
    width: 26,
    height: 26,
  },
});
