import AsyncStorage from '@react-native-community/async-storage';
import { HeaderBackground } from '@react-navigation/stack';
import {Keyboard, Platform, NetInfo, Alert} from 'react-native';
import moment from 'moment';

import Language from '../resources/Language.js';

export default class Utils {
  static getcurrency = (currenCy) =>{
      return currenCy.toString().split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev
      })
  }
  static getDayMonthYearString = date => {
    return moment(date).format("DD/MM/YYYY");
  };
  static getDayMonthYearHourStringDetail = date => {
    return moment(date).format("DD/MM/YYYY HH:mm");
  };
  static getDateTimeFormatToAPI = date=>{
    return moment(date).format("YYYY-MM-DDTHH:mm");
  }

  static getMonthDayYearString = date => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let returnString = month + '/' + day + '/' + year;

    return returnString;
  };

  static getFirstDateOfMonth = () => {
    // let currentDate = new Date();

    // let month = currentDate.getMonth() + 1;
    // let year = currentDate.getFullYear();

    // let dateString = month + '/01/' + year;
    // let newDate = new Date(dateString);
    // return newDate;
    let today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2, "0", "0", "0");
  };

  /// Username
  static saveUserModel = async model => {
    try {
      await AsyncStorage.setItem('@UserModel', JSON.stringify(model));
    } catch (error) {
      // Error saving data
    }
  };

  static getUserModel = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@UserModel')
        .then(res => {
          if (res !== null) {
            resolve(JSON.parse(res));
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  };

  /// WebApi
  static saveWebApi = async webApi => {
    try {
      await AsyncStorage.setItem('@WebApi', webApi);
    } catch (error) {
      // Error saving data
    }
  };

  static getWebApi = async () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@WebApi')
        .then(res => {
          if (res !== null) {
            resolve(res);
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  };

  //siteid & storeID
  static saveStoreConfig = async config => {
    try {
      await AsyncStorage.setItem('@StoreConfig', config);
    } catch (error) {
      // Error saving data
    }
  };

  static getStoreConfig = async () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@StoreConfig')
        .then(res => {
          if (res !== null) {
            resolve(res);
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  };

  //Sync date
  static saveSyncDate = async date => {
    try {
      await AsyncStorage.setItem('@SyncDate', date);
    } catch (error) {
      // Error saving data
    }
  };

  static getSyncDate = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem('@SyncDate')
        .then(res => {
          if (res !== null) {
            resolve(res);
          } else {
            resolve(null);
          }
        })
        .catch(err => reject(err));
    });
  };

  static dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  static guidGenerator() {
    var S4 = function() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      '-' +
      S4() +
      S4() +
      S4()
    );
  }

  static getValueWithNDecimal(value, n) {
    var newVal = Math.round(value * Math.pow(10, n) + Number.EPSILON) / 1000;
    return newVal.toFixed(n).toString();
  }

  static isAndroid() {
    return Platform.OS !== 'ios';
  }

  static removeAccents(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/, 'y');
    str = str.replace(/đ/, 'd');
    str = str.replace(/k/, 'k');

    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/, 'A');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/, 'E');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/, 'I');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/, 'O');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/, 'U');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/, 'Y');
    str = str.replace(/Đ/, 'D');
    str = str.replace(/K/, 'k');

    str = str.replace(/ò/, 'o');

    return str;
  }

  static validateURL(value) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(
      value,
    );
  }
  static showAlert(message) {
    setTimeout(() => {
      Alert.alert(
        Language.ALERT,
        message,
        [
          {
            text: Language.OK,
          },
        ],
        {cancelable: false},
      );
    }, 100);
  }
  static removeForbiddenCharacters = input => {
    let forbiddenChars = ['/', '*', '+'];

    for (let char of forbiddenChars) {
      input = input.split(char).join('');
    }
    return input;
  };
  static checkQuantity(value){
    value = this.removeForbiddenCharacters(value);
    let temp_Quantity = parseFloat(value);
    let quantity = isNaN(temp_Quantity) ? 0 : temp_Quantity;
    if (quantity >= 0) {
      quantity = value;
    } else {
      quantity = 0;
    }
    return quantity;
  }
  
}
