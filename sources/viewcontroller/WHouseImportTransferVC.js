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
  Alert,
  RefreshControl,
} from 'react-native';
import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDatePOP from '../popup/SelectDatePOP.js';
import ErrolPOP from '../popup/ErrolPOP.js';
import SuccessPOP from '../popup/SuccessPOP.js';
const db = database();
import {StockTakeModel} from '../models/StockTakeModel.js';
import SelectItemPOP from '../popup/SelectItemPOP.js';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import {SwipeListView} from 'react-native-swipe-list-view';
import moment from 'moment';
import ItemWhouseImportTransferCell from '../cells/ItemWhouseImportTransferCell.js';

export default class WHouseImportTransferVC extends Component {
  constructor(props) {
    super(props);
    let currentDate = new Date();
    let firstDate = Utils.getFirstDateOfMonth();
    this.itemAddStock = {
      model: {
        StockID: '',
        StockCode: '0',
        StockName: 'Tất cả',
      },
    };
    this.state = {
      refreshing: false,
      fromDate: firstDate,
      toDate: currentDate,
      pageIndex: 1,
      searchString: '',
      listOutTransferIn: [],
      count: 0,
      datePopupVisible: false,
      stockPopupVisible: false,
      stockPopupVisible2: false,
      deleteOutTranferVisible: false,
      visibleError: false,
      visibleError2: false,
      stock: null,
      stock2: null,
      loading: false,
      errorDescription: '',
      totalRow: 0,
      fromStockID: '',
      toStockID: '',
      invoiceID: '',
    };
    this.isFromDate = true;
  }
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.setState(
        {
          listOutTransferIn: [],
          pageIndex: 1,
        },
        () => {
          this.getStockInTransfer();
        },
      );
    });
  }
  deleteStockInTransfer = async () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/DeleteStockInTransfer?GUIID=' + global.GUIID;
    let body = {
      UserID: global.UserModel.UserID,
      id: this.state.invoiceID,
    };
    axios
      .post(url, body)
      .then(responseJson => {
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
          if (status == 1) {
            this.setState({deleteOutTranferVisible: true});
          } else {
            if (data.ErrorCode == 'User_not_found') {
              Utils.saveUserModel(null);
              this.props.navigation.navigate('LoginVC');
            } else {
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
  getStockInTransfer = async () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/GetStockInTransferList?GUIID=' + global.GUIID;
    let body = {
      PageIndex: this.state.pageIndex.toString(),
      FromDate: this.state.fromDate,
      ToDate: this.state.toDate,
      SearchString: this.state.searchString,
      FromStockID: this.state.fromStockID,
      ToStockID: this.state.toStockID,
      UserID: global.UserModel.UserID,
    };
    axios
      .post(url, body)
      .then(responseJson => {
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({
            errorDescription: data.ErrorDescription,
          });
          if (status == 1) {
            if (data.InvoiceList && data.InvoiceList.length > 0) {
              this.setState({
                listOutTransferIn: [
                  ...this.state.listOutTransferIn,
                  ...data.InvoiceList,
                ],
                totalRow: data.TotalRow,
              });
              this.setState({refreshing: false});
            }
          } else {
            if (data.ErrorCode == 'User_not_found') {
              Utils.saveUserModel(null);
              this.props.navigation.navigate('LoginVC');
            } else {
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
  renderTotal() {
    if (this.state.listOutTransferIn.length > 0) {
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
            {this.state.listOutTransferIn.length}/{this.state.totalRow}
          </Text>
        </View>
      );
    } else {
      return <View />;
    }
  }
  onRefresh() {
    this.setState(
      {
        listOutTransferIn: [],
        pageIndex: 1,
        refreshing: true,
      },
      () => {
        this.getStockInTransfer();
      },
    );
  }
  _AddNewInTransfer = () => {
    Utils.getSyncDate()
      .then(res => {
        if (res !== null) {
          let currentDate = new Date();
          let day =
            currentDate.getDate() < 10
              ? '0' + currentDate.getDate().toString()
              : currentDate.getDate().toString();
          let month =
            currentDate.getMonth() + 1 < 10
              ? '0' + (currentDate.getMonth() + 1).toString()
              : (currentDate.getMonth() + 1).toString();
          let year = currentDate.getFullYear().toString();

          const arr = res.split('/');

          if (arr.length == 3) {
            if (day === arr[0] && month === arr[1] && year === arr[2]) {
              this.props.navigation.navigate('AddNewWHouseImportTransfer', {
                OutTransfer: null,
              });
              return;
            }
          }

          this.setState({
            visibleError: true,
            errorDescription: Language.ALERT_SYNC_DATA,
          });
        } else {
          this.setState({
            visibleError: true,
            errorDescription: Language.ALERT_SYNC_DATA,
          });
        }
        // console.log(res)
      })
      .catch(err => Utils.showAlert(err));
  };
  handleLoadMore = () => {
    this.setState(
      {
        pageIndex: this.state.pageIndex + 1,
      },
      () => {
        this.getStockInTransfer();
      },
    );
  };
  _searchInTransfer = () => {
    this.setState(
      {
        datePopupVisible: false,
        listOutTransferIn: [],
        pageIndex: 1,
        fromStockID: this.state.stock ? this.state.stock.StockID : '',
        toStockID: this.state.stock2 ? this.state.stock2.StockID : '',
      },
      () => {
        this.getStockInTransfer();
      },
    );
  };
  _itemSelected_click = data => {
    this.props.navigation.push('AddNewWHouseImportTransfer', {
      InTransfer: data,
    });
  };
  renderList() {
    if (this.state.listOutTransferIn.length > 0)
      return (
        <View style={styles.backgroudBodybody}>
          <View>
            <SwipeListView
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.refreshing}
              data={this.state.listOutTransferIn}
              initialNumToRender={20}
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                console.log('onEndReached');
                this.handleLoadMore();
              }}
              renderItem={({item, index}) => (
                <ItemWhouseImportTransferCell
                  data={item}
                  index={index}
                  onPressItem={() => this._itemSelected_click(item)}
                  deleteCheckPressed={this._deleteCheckPressed}
                />
              )}
              keyExtractor={item => item.InvoiceID}
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
            Không có dữ liệu!
          </Text>
        </View>
      );
  }
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
      atePopupVisible: false,
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
  //Stock
  _stockButton_click = () => {
    Keyboard.dismiss();
    this.setState({stockPopupVisible: true});
  };

  _cancelSelectStock_event = () => {
    this.setState({stockPopupVisible: false});
  };

  _okSelectStock_event = stockSelected => {
    this.setState({
      stockPopupVisible: false,
      stock: stockSelected,
    });
  };
  //Stock2
  _stockButton_click2 = () => {
    Keyboard.dismiss();
    this.setState({stockPopupVisible2: true});
  };

  _cancelSelectStock_event2 = () => {
    this.setState({stockPopupVisible2: false});
  };

  _okSelectStock_event2 = stockSelected2 => {
    this.setState({
      stockPopupVisible2: false,
      stock2: stockSelected2,
    });
  };
  _back_click = () => {
    this.props.navigation.goBack();
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_event2 = () => {
    this.setState({visibleError: false});
    this.props.navigation.goBack();
  };
  _deleteCheckPressed = data => {
    this.setState(
      {
        invoiceID: data.InvoiceID,
      },
      () => {
        this.deleteStockInTransfer();
      },
    );
  };
  _popupOK_eventdeleteTranfer = () => {
    this.setState(
      {
        deleteOutTranferVisible: false,
        listOutTransferIn: [],
        pageIndex: 1,
      },
      () => {
        this.getStockInTransfer();
      },
    );
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.deleteOutTranferVisible}
          onTouchOutside={() => {}}>
          {/* <ModalContent> */}
          <SuccessPOP
            ErrorDescription={Language.SUCECCDELETE_INTRANFER}
            okEvent={this._popupOK_eventdeleteTranfer}
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
          <ErrolPOP
            ErrorDescription={Language.NOT_EXIST_API}
            okEvent={this._popupOK_event2}
          />
          {/* </ModalContent> */}
        </Modal>
        <Spinner
          visible={this.state.loading}
          textContent={'Đang tải...'}
          textStyle={{color: '#FFF'}}
        />
        <View style={styles.headerView}>
          <Text style={styles.headerTitle}>Nhập chuyển kho</Text>
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
              <View style={styles.viewDateItem}>
                <Text style={styles.lable}>
                  {Language.EXPORT_WAREHOUSE + ':'}
                </Text>
                <TouchableOpacity
                  style={styles.backgroudtxtdate}
                  onPress={this._stockButton_click2}>
                  <Text style={styles.lableVal}>
                    {this.state.stock2 ? this.state.stock2.StockName : 'Tất cả'}
                  </Text>
                  <Image
                    style={styles.imageArrow}
                    source={require('../resources/down-arrow.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.viewDateItem}>
                <Text style={styles.lable}>
                  {Language.RECEIVING_WAREHOUSE + ':'}
                </Text>
                <TouchableOpacity
                  style={styles.backgroudtxtdate}
                  onPress={this._stockButton_click}>
                  <Text style={styles.lableVal}>
                    {this.state.stock ? this.state.stock.StockName : 'Tất cả'}
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
                placeholder={Language.INPUT_TEXT_FIND_CHECK_ORDER2}
              />
            </View>
            <View
              style={{
                paddingTop: 10,
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              <TouchableOpacity
                onPress={this._searchInTransfer}
                style={styles.findButton2}>
                <Text style={styles.textButton}>Tìm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this._AddNewInTransfer}
                style={styles.findButton}>
                <Text style={styles.textButton}>Thêm mới</Text>
              </TouchableOpacity>
              <View style={{marginTop: 0}}>
                <Text style={styles.txtGhichu}>Chú thích:</Text>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <View style={{flexDirection: 'column', marginRight: 3}}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={styles.imageghichu}
                        source={require('../resources/check.png')}
                      />
                      <Text style={styles.txtGhichu}>: Đã ghi sổ</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={styles.imageghichu}
                        source={require('../resources/noncheck.png')}
                      />
                      <Text style={styles.txtGhichu}>: Chưa ghi sổ</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={styles.imageghichu2}
                        source={require('../resources/blue.png')}
                      />
                      <Text style={styles.txtGhichu}>: Mở</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'column'}}>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={styles.imageghichu2}
                        source={require('../resources/Greens.png')}
                      />
                      <Text style={styles.txtGhichu}>: Đang chuyển</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Image
                        style={styles.imageghichu2}
                        source={require('../resources/Black.png')}
                      />
                      <Text style={styles.txtGhichu}>: Hoàn tất</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {/* Render list */}
          <View style={styles.grouplist}>{this.renderList()}</View>
          {/*Render total*/}
          <View style={styles.groupbutton}>{this.renderTotal()}</View>
        </View>
        {this._renderCalendar()}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.stockPopupVisible}
          onTouchOutside={() => {
            this.setState({stockPopupVisible: false});
          }}>
          <SelectItemPOP
            value={this.state.stock}
            addItem={this.itemAddStock}
            cancelEvent={this._cancelSelectStock_event}
            okEvent={this._okSelectStock_event}
          />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.stockPopupVisible2}
          onTouchOutside={() => {
            this.setState({stockPopupVisible2: false});
          }}>
          <SelectItemPOP
            value={this.state.stock2}
            addItem={this.itemAddStock}
            cancelEvent={this._cancelSelectStock_event2}
            okEvent={this._okSelectStock_event2}
          />
        </Modal>
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
    paddingRight: 5,
    paddingTop: 3,
    paddingLeft: 5,
    flex: 2.7,
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
  findButton2: {
    width: 85,
    marginBottom: 15,
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginRight: 10,
  },
  findButton: {
    width: 85,
    marginBottom: 15,
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  textButton: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  backgroudtxtdate: {
    paddingHorizontal: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: 155,
    borderRadius: 5,
    height: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intputextheader: {
    height: 35,
    width: '94%',
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
    backgroundColor: '#fff',
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
  txtGhichu: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  imageghichu: {
    marginRight: 5,
    marginTop: 3,
    width: 15,
    height: 15,
  },
  imageghichu2: {
    marginRight: 5,
    marginTop: 3,
    width: 15,
    height: 15,
    borderRadius: 15,
  },
});
