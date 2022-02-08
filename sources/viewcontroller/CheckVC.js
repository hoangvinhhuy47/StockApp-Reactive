import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  BackHandler, 
  ToastAndroid,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import database from '../Database.js';
const db = database();

import RequestCheckCell from '../cells/RequestCheckCell.js';
import SelectDatePOP from '../popup/SelectDatePOP.js';
import ErrolPOP from '../popup/ErrolPOP.js';
import OkAndClosePOP from '../popup/OkAndClosePOP.js';
import ErrorPOP2 from '../popup/ErrorPOP2.js';
import {SwipeListView} from 'react-native-swipe-list-view';
import DateTimePicker from '@react-native-community/datetimepicker';

// https://github.com/react-native-community/react-native-datetimepicker
// su dung datetime picker
export default class CheckVC extends Component {
  constructor(props) {
    super(props);

    let currentDate = new Date();
    let firstDate = Utils.getFirstDateOfMonth();

    this.state = {
      count: 0,
      datePopupVisible: false,
      fromDate: firstDate,
      toDate: currentDate,
      arrayStockTake: [],
      visibleError: false,
      visibleErrordelete: false,
      errorDescription: '',
      exitApp: false,
    };

    this.isFromDate = true;
    this.arrayStockTakeConst = [];

    //for check add new Check
    this.listStock = [];
    this.listProduct = [];
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
    this.props.navigation.addListener('focus', () => {
      this._getData();
      this.setState({datePopupVisible: false})
    });
    this.backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      this.backAction
    );
  }
  componentWillUnmount() {
    this.backHandler.remove();
  }

  _getData = () => {
    this._getListCheck();

    db.getListStock()
      .then(data => {
        this.listStock = data;
      })
      .catch(err => {});

    db.getListProduct()
      .then(data => {
        this.listProduct = data;
      })
      .catch(err => {});

    db.initDBDetailAddProduct()
      .then(data => {})
      .catch(err => {});
  };

  _getListCheck = () => {
    db.getListStockTake()
      .then(data => {
        this.arrayStockTakeConst = data;

        let newData = this.arrayStockTakeConst.filter(item => {
          return this.checkDateInRange(
            item.model.AccountingDate,
            this.state.fromDate,
            this.state.toDate,
          );
        });
        this.setState({arrayStockTake: newData});
      })
      .catch(err => {});
  };

  //handle action
  _addNewForm_click = async () => {
    Utils.getSyncDate()
      .then(res => {
        if (res !== null) {
          let currentDate = new Date();
          let day =  currentDate.getDate() < 10 ? '0' + currentDate.getDate().toString() : currentDate.getDate().toString();
          let month = (currentDate.getMonth() + 1) < 10 ? '0' + (currentDate.getMonth() + 1).toString() : (currentDate.getMonth() + 1).toString();
          let year = currentDate.getFullYear().toString();

          const arr = res.split('/');

          if (arr.length == 3) {
            if (day === arr[0] && month === arr[1] && year === arr[2]) {
              this.props.navigation.push('NewRequestCheckFormVC', {
                checkForm: null,
              });
              return;
            }
          }
         this.setState({visibleError: true})
        } else {
          this.setState({visibleError: true})
        }
        // console.log(res)
      })
      .catch(err => Utils.showAlert(err));
  };

  _findButton_click = () => {
    let data = this.arrayStockTakeConst.filter(item => {
      return this.checkDateInRange(
        item.model.AccountingDate,
        this.state.fromDate,
        this.state.toDate,
        this.setState({datePopupVisible: false}),
      );
    });

    this.setState({arrayStockTake: data});
  };

  checkDateInRange = (date, startDate, endDate) => {
    //date
    let dateVal = new Date(Number(date));
    let dateString = Utils.getMonthDayYearString(dateVal);
    let newDate = new Date(dateString);

    let startDateString = Utils.getMonthDayYearString(startDate);
    let newStartDate = new Date(startDateString);

    let endDateString = Utils.getMonthDayYearString(endDate);
    let newEndDate = new Date(endDateString);

    let result = false;
    if (newDate >= newStartDate && newDate <= newEndDate) {
      result = true;
    }

    return result;
  };

  _itemSelected_click = data => {
    this.props.navigation.push('RequestCheckFormDetail', {stock: data});
  };

  //Date
  _fromDateButton_click = () => {
    this.isFromDate = true;
    this.setState({datePopupVisible: true});
  };

  _toDateButton_click = () => {
    this.isFromDate = false;
    this.setState({datePopupVisible: true});
  };

  _cancelSelectDate_event = () => {
    this.setState({datePopupVisible: false});
  };

  _okSelectDate_event = (isFrom, date) => {
    if (isFrom) {
      this.setState({
        datePopupVisible: false,
        fromDate: date,
      });
    } else {
      this.setState({
        datePopupVisible: false,
        toDate: date,
      });
    }
  };

  //edit delete check form
  _editCheckPressed = data => {
    this.props.navigation.push('NewRequestCheckFormVC', {checkForm: data});
  };

  _deleteCheckPressed = data => {
    Alert.alert(
      Language.ALERT,
      'Xoá phiếu kiểm kho?',
      [
        {
          text: Language.CANCEL,
          onPress: () => {},
        },
        {
          text: Language.OK,
          onPress: () => {
            this._deleteCheckFunc(data.StockTakeID);
          },
        },
      ],
      {cancelable: false},
    );
  };

  _deleteCheckFunc = stockTakeID => {
    db.deleteProductStockTakeByStockTakeID(stockTakeID)
      .then(data => {
        db.deleteStockTake(stockTakeID)
          .then(data => {
            this._getListCheck();
          })
          .catch(err => {});
      })
      .catch(err => {});
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  // _popupOK_event2 = () => {
  //   this.setState({visibleErrordelete: false});
  // };
  // _popupcancel_event2 = () =>{
  //   this.setState({visibleErrordelete: false});
  // }

  deleteRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }

    const prevIndex = this.state.arrayStockTake.findIndex(
      item => item.model.StockTakeID === rowKey,
    );

    this._deleteCheckPressed(this.state.arrayStockTake[prevIndex].model);
  };

  _onChangeDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      return;
    }

    if (this.isFromDate) {
      this.setState({
        datePopupVisible: false,
        fromDate: selectedDate,
      });
    } else {
      this.setState({
        datePopupVisible: false,
        toDate: selectedDate,
      });
    }
  };

  _renderCalendar = () => {
    if (Utils.isAndroid()) {
      if (this.state.datePopupVisible) {
        return (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={-4200}
            value={this.isFromDate ? this.state.fromDate : this.state.toDate}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={this._onChangeDate}
          />
        );
      }

      return null;
    } else {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.datePopupVisible}
          onTouchOutside={() => {
            this.setState({datePopupVisible: false});
          }}>
          <SelectDatePOP
            typePopup={this.isFromDate}
            value={this.isFromDate ? this.state.fromDate : this.state.toDate}
            cancelEvent={this._cancelSelectDate_event}
            okEvent={this._okSelectDate_event}
          />
        </Modal>
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={Language.ALERT_SYNC_DATA}
          okEvent={this._popupOK_event}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleErrordelete}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <OkAndClosePOP
          ErrorDescription={Language.ALERT_SYNC_DATA}
          cancelEvent={this._popupcancel_event2}
          okEvent={this._popupOK_event2}
          />
          {/* </ModalContent> */}
        </Modal>
        {/* render header */}
        <View style={styles.headerView}>
          <View style={styles.viewAvatar}>
            <Image
              style={styles.avatarImage}
              source={require('../resources/avatar.png')}
            />
            <Text style={styles.headerTitle}>{global.UserModel.FullName}</Text>
          </View>
          <TouchableOpacity onPress={this._addNewForm_click}>
            <Image
              style={styles.headerRightButton}
              source={require('../resources/add.png')}
            />
          </TouchableOpacity>
        </View>

        {/* render find button */}
        <View style={styles.headerbody}>
          <View style={styles.viewButtonDate}>
            <View style={styles.viewDateItem}>
              <Text style={styles.lable}>{Language.FROM_DATE + ':'}</Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  borderBottomWidth: 1,
                  borderBottomColor: '#000',
                  width: 120,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={this._fromDateButton_click}>
                <Text style={styles.lableVal}>
                  {Utils.getDayMonthYearString(this.state.fromDate)}
                </Text>
                <Image
                  style={styles.imageArrow}
                  source={require('../resources/down-arrow.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.viewDateItem2}>
              <Text style={styles.lable}>{Language.TO_DATE + ':'}</Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 1,
                  borderBottomColor: '#000',
                  width: 120,
                  alignItems: 'center',
                }}
                onPress={this._toDateButton_click}>
                <Text style={styles.lableVal}>
                  {Utils.getDayMonthYearString(this.state.toDate)}
                </Text>
                <Image
                  style={styles.imageArrow}
                  source={require('../resources/down-arrow.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
              style={styles.findButton}
              onPress={this._findButton_click}>
              <Text style={styles.textButton}>Tìm</Text>
            </TouchableOpacity>
        </View>

        {/* Render list */}
        <SwipeListView
          data={this.state.arrayStockTake}
          renderItem={({item, index}) => (
            <RequestCheckCell
              data={item.model}
              index={index}
              onPressItem={this._itemSelected_click}
              editCheckPressed={this._editCheckPressed}
              deleteCheckPressed={this._deleteCheckPressed}
            />
          )}
          keyExtractor={item => item.model.StockTakeID.toString()}
        />

        {/* Render popup choose date*/}
        {this._renderCalendar()}
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
  viewButtonDate: {
    paddingTop: 3,
    paddingLeft: 5,
    paddingRight: 8,
    flex: 2,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  viewDateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginRight:20
  },
  viewDateItem2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  lable: {
    fontSize: 18,
    width: 100,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 5,
  },
  lableVal: {
    fontSize: 18,
    marginRight: 10,
    marginBottom: 3,
  },
  imageArrow: {
    width: 17,
    height: 17,
  },
  findButton: {
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerbody: {
    paddingVertical:5,
    flexDirection: 'row',
    backgroundColor: '#e6faf3',
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    padding:5,
    justifyContent:'space-between',
    alignItems:'center'
  },
});
