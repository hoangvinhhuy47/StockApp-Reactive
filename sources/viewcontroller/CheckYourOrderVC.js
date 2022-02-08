import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import Language from '../resources/Language.js';
import ErrolPOP from '../popup/ErrolPOP.js';
import ErrorPOP2 from '../popup/ErrorPOP2.js';
import Utils from '../common/Utils.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDatePOP from '../popup/SelectDatePOP.js';
import ItemCheckOderCell from '../cells/ItemCheckOderCell';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
export default class CheckYourOrderVC extends Component {
  constructor(props) {
    super(props);
    let currentDate = new Date();
    let firstDate = Utils.getFirstDateOfMonth();

    this.state = {
      refreshing: false,
      count: 0,
      datePopupVisible: false,
      fromDate: firstDate,
      toDate: currentDate,
      listOrder: [],
      searchString: '',
      pageIndex: 1,
      loading: false,
      totalRow: 0,
      pageSize: 0,
      totalRowSize: 0,
      loadedRows: 0,
      visibleError: false,
      visibleError2: false,
      errorDescription: '',
    };
    this.isFromDate = true;
  }
  onRefresh()  {
    this.setState(
      {
        listOrder:[],
        pageIndex: 1,
        refreshing: true,
      },
      () => {
        this.getOrders();
      },
    );
  }
  getOrders = async () => {
    this.setState({loading: true});
    let url = global.WebAPI + '/API/stock/getOrderList?GUIID=' + global.GUIID;
    let body = {
      PageIndex: this.state.pageIndex.toString(),
      FromDate: this.state.fromDate,
      ToDate: this.state.toDate,
      SearchString: this.state.searchString,
      UserID: global.UserModel.UserID,
    };
    axios
      .post(url, body)
      .then(responseJson => {
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription})
          if (status == 1) {
            if (data.OrderList && data.OrderList.length > 0) {
              this.setState({
                listOrder: [...this.state.listOrder, ...data.OrderList],
                totalRow: data.TotalRow,
                pageSize: data.PageSize,
              });
              this.setState({refreshing: false})
            }
          } else {
            if(data.ErrorCode=="User_not_found"){
              Utils.saveUserModel(null);
              this.props.navigation.navigate('LoginVC');
            }else{
              this.setState({visibleError: true});
            }
          }
          this.setState({
            loading: false,
          });
        }
      })
      .catch(error => {
        this.setState({loading: false});
        this.setState({visibleError2: true});
        console.log('errror', error.response);
      });
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_event2 = () => {
    this.setState({visibleError2: false});
    this.props.navigation.goBack();
  };
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          listOrder: [],
          pageIndex: 1,
        },
        () => {
          this.getOrders();
        },
      );
    });
  }
  _back_click = () => {
    this.props.navigation.goBack();
  };
  //scan
  _scan_click = () => {
    this.props.navigation.navigate('CameraCheckOrderVC', {
      scanComplete: this._cameraOK_event.bind(this),
    });
  };
  //come from camera
  _cameraOK_event = () => {
    this._getListProductStockTake();
  };

  _findButton_click = () => {
    // let data = this.arrayStockTakeConst.filter(item => {
    //   return this.checkDateInRange(
    //     item.model.AccountingDate,
    //     this.state.fromDate,
    //     this.state.toDate,
    //   );
    // });
    // this.setState({arrayStockTake: data});
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
    this.props.navigation.push('CheckOrderDetail', {Order: data});
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

  _cancelSelectDate_event = (isFrom, date) => {
    this.setState({
      datePopupVisible: false,
    });
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
  handleLoadMore = () => {
    // her you put the logic to load some data with pagination
    // for example a service who return the data of the page "this.state.pageIndex"
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1,
      },
      () => {
        this.getOrders();
      },
    );
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
  _searchOrder = () => {
    this.setState(
      {
        datePopupVisible: false,
        listOrder: [],
        pageIndex: 1,
      },
      () => {
        this.getOrders();
      },
    );
  };
  renderTotal() {
    if (this.state.listOrder.length > 0) {
      return (
        <View
          style={{
            width: 85,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#5EB45F',
              fontWeight: '700',
              fontSize: 15,
              fontStyle: 'italic',
            }}>
            {this.state.listOrder.length}/{this.state.totalRow}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  }
  renderList() {
    if (this.state.listOrder.length > 0)
      return (
        <View style={styles.backgroudBodybody}>
          <View>
            <FlatList
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.refreshing}
              data={this.state.listOrder}
              initialNumToRender={20} // how many item to display first
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                console.log('onEndReached');
                this.handleLoadMore();
              }}
              renderItem={({item, index}) => (
                <ItemCheckOderCell
                  data={item}
                  index={index}
                  onPressItem={this._itemSelected_click}
                />
              )}
              keyExtractor={item => item.OrderID}
            />
          </View>
        </View>
      );
    else
      return (
        <View
          style={{
            flex: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={{height: 70, width: 110, marginBottom: 10}}
            source={require('../resources/unnamed.png')}
          />
          <Text style={{fontSize: 14, color: '#ca0000'}}>
            Không có đơn hàng nào!
          </Text>
        </View>
      );
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
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
            textContent={'Đang tải...'}
            textStyle={{color: '#FFF'}}
          />
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>
              {Language.ADD_NEW_CHECKORDER_TITLE}
            </Text>
            <TouchableOpacity onPress={this._back_click}>
              <Image
                style={styles.buttonLogout}
                source={require('../resources/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.containerBody}>
            <View style={styles.headerbody}>
              <View style={styles.viewButtonDate}>
                <View style={styles.viewDateItem}>
                  <Text style={styles.lable}>{Language.FROM_DATE + ':'}</Text>
                  <TouchableOpacity
                    style={styles.backgroudtxtdate}
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
                <View style={styles.viewDateItem}>
                  <Text style={styles.lable}>{Language.TO_DATE + ':'}</Text>
                  <TouchableOpacity
                    style={styles.backgroudtxtdate}
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
                <TextInput
                  style={styles.intputextheader}
                  value={this.state.searchString}
                  onChangeText={searchString => this.setState({searchString})}
                  placeholder={Language.INPUT_TEXT_FIND_CHECK_ORDER}
                />
              </View>
              <View
                style={{
                  paddingTop: 10,
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={this._searchOrder}
                  style={styles.findButton}>
                  <Text style={styles.textButton}>Tìm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.backgroudscan}
                  onPress={this._scan_click}>
                  <Image
                    style={styles.imageScan}
                    source={require('../resources/icons8_qr.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/* Render list */}
            <View style={styles.grouplist}>{this.renderList()}</View>
            <View style={styles.groupbutton}>{this.renderTotal()}</View>
          </View>
          {this._renderCalendar()}
        </SafeAreaView>
      </TouchableWithoutFeedback>
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
  headerTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  buttonLogout: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  containerBody: {
    flex: 1,
    paddingBottom: 5,
  },
  headerbody: {
    flexDirection: 'row',
    backgroundColor: '#e6faf3',
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
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
    marginBottom: 5,
    flexDirection: 'row',
  },
  lable: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    width: 90,
  },
  lableVal: {
    fontSize: 16,
    marginRight: '4%',
  },
  imageArrow: {
    width: 15,
    height: 15,
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
    marginBottom: 15,
    marginRight: 10,
  },
  textButton: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  backgroudtxtdate: {
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 120,
    borderRadius: 5,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  intputextheader: {
    marginRight: 8,
    height: 35,
    width: '100%',
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingVertical: 0,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  backgroudscan: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    marginRight: 10,
    elevation: 5,
    backgroundColor:'#fff'
  },
  imageScan: {
    width: 55,
    height: 55,
  },
  backgroudBodybody: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    marginTop: '0.5%',
  },
  groupbutton: {
    width: '100%',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grouplist: {
    flex: 1,
    paddingBottom: 10,
  },
});
