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
  ScrollView,
} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';
import SelectDatePOP from '../popup/SelectDatePOP.js';
import ErrolPOP from '../popup/ErrolPOP.js';
import SelectItemPOP from '../popup/SelectItemPOP.js';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemWHouseTransferDetailCell from '../cells/ItemWHouseTransferDetailCell.js';
import SuccessPOP from '../popup/SuccessPOP.js';
import AddNewProductPOP from '../popup/AddNewProductPOP.js';
import Database from '../Database.js';
const db = database();
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
export default class AddNewWHouseTransfer extends Component {
  constructor(props) {
    super(props);
    this.outTransfer = this.props.route.params.OutTransfer;
    this.ItemScan = '';
    this.itemAddStock = {
      model: {
        StockID: '0',
        StockCode: '0',
        StockName: 'Chọn tất cả',
      },
    };
    if (this.outTransfer != null) {
      // detail
      this.state = {
        listOutTransferDetail: [],
        datePopupVisible: false,
        tostockPopupVisible: false,
        fromstockPopupVisible: false,
        visibleError: false,
        visibleError2: false,
        visibleSuccess: false,
        visibleSuccessUpdateOuttranfer: false,
        visibleSuccessAddOuttranfer: false,
        visibleAddNew: false,
        visibleRongxuat: false,
        visibleRongnhan: false,
        loading: false,
        dateCheck: new Date(this.outTransfer.AccountingDate),
        invoiceCode: this.outTransfer.InvoiceCode,
        toStock: null,
        fromStock: null,
        note: this.outTransfer.Notes,
        isPost: this.outTransfer.IsPosted,
        isChangePost: false,
      };
      db.getStockById(this.outTransfer.FromStockID)
        .then(result => {
          this.setState({fromStock: result});
        })
        .catch(err => {});
      db.getStockById(this.outTransfer.ToStockID)
        .then(result => {
          this.setState({toStock: result});
        })
        .catch(err => {});
    } else {
      //add new
      this.state = {
        listOutTransferDetail: [],
        datePopupVisible: false,
        tostockPopupVisible: false,
        fromstockPopupVisible: false,
        visibleError: false,
        visibleError2: false,
        visibleSuccess: false,
        visibleSuccessUpdateOuttranfer: false,
        visibleSuccessAddOuttranfer: false,
        visibleAddNew: false,
        visibleRongxuat: false,
        visibleRongnhan: false,
        loading: false,
        dateCheck: new Date(),
        toStock: null,
        fromStock: null,
        invoiceCode: '',
        note: '',
        isPost: false,
        isChangePost: false,
      };
      //for edit product
      this.selectProduct = null;
      this.arrayProductConst = [];
    }
    this.isFromDate = true;
  }

  //Popup add new event
  _popupCancelAddnew_event = () => {
    this.setState({visibleAddNew: false});
  };

  _popupOKAddnew_event = item => {
    let found = this.state.listOutTransferDetail.find(
      x => x.ProductID == item.ProductID,
    );
    if (found) {
      found.Quantity += item.Quantity;
      const tempData = this.state.listOutTransferDetail;
      this.setState(
        {
          listOutTransferDetail: [...tempData],
        },
        () => {},
      );
    } else {
      (item.InvoiceID = ''),
        (item.InvoiceDetailID = ''),
        (item.SortOrder = 1),
        this.setState({
          listOutTransferDetail: this.state.listOutTransferDetail.concat([
            item,
          ]),
        });
    }
  };
  _popupOKAddnew_event2 = listItem => {
    const tempData = this.state.listOutTransferDetail;
    let _addList = [];
    for (let i = 0; i < listItem.length; i++) {
      let item = listItem[i];
      let found = this.state.listOutTransferDetail.find(
        x => x.ProductID == item.ProductID,
      );
      if (found) {
        found.Quantity += item.Quantity;
      } else {
        (item.InvoiceID = ''),
          (item.InvoiceDetailID = ''),
          (item.SortOrder = 1);

        _addList.push(item);
      }
    }
    const list = [...tempData].concat(_addList);
    this.setState(
      {
        listOutTransferDetail: [...list],
      },
      () => {
        console.log(this.state.listOutTransferDetail);
      },
    );
  };

  addStockOutTransfer = async () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/AddStockOutTransfer?GUIID=' + global.GUIID;
    let body = {
      UserID: global.UserModel.UserID,
      IsPost: this.state.isChangePost,
      StockOutTransfer: {
        Notes: this.state.note,
        AccountingDate: Utils.getDateTimeFormatToAPI(this.state.dateCheck),
        FromStockID: this.state.fromStock.StockID,
        ToStockID: this.state.toStock.StockID,
        FromStockName: this.state.fromStock.StockName,
        ToStockName: this.state.toStock.StockName,
        IsPosted: this.state.isPost,
      },
      StockOutTransferDetailList: this.state.listOutTransferDetail,
    };
    console.log('body', body);
    axios
      .post(url, body)
      .then(responseJson => {
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
          if (status == 1) {
            this.setState({visibleSuccessAddOuttranfer: true});
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
  updateStockOutTransfer = async () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/UpdateStockOutTransfer?GUIID=' + global.GUIID;
    let body = {
      UserID: global.UserModel.UserID,
      IsPost: this.state.isChangePost,
      StockOutTransfer: {
        InvoiceID: this.outTransfer.InvoiceID,
        Notes: this.state.note,
        InvoiceCode: this.outTransfer.InvoiceCode,
        AccountingDate: this.state.dateCheck,
        FromStockID: this.state.fromStock.StockID,
        ToStockID: this.state.toStock.StockID,
        FromStockName: this.state.fromStock.StockName,
        ToStockName: this.state.toStock.StockName,
        IsPosted: this.state.isPost,
        RefID: this.outTransfer.RefID,
        RefCode: this.outTransfer.RefCode,
        RefType: this.outTransfer.RefType,
        EmployeeID: this.outTransfer.EmployeeID,
        EmployeeName: this.outTransfer.EmployeeName,
        StatusName: this.outTransfer.StatusName,
      },
      StockOutTransferDetailList: this.state.listOutTransferDetail,
    };
    axios
      .post(url, body)
      .then(responseJson => {
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
          if (status == 1) {
            this.setState({visibleSuccessUpdateOuttranfer: true});
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
  getStockOutTransfer = async () => {
    let url =
      global.WebAPI +
      '/API/stock/GetStockOutTransferById?GUIID=' +
      global.GUIID +
      '&userId=' +
      global.UserModel.UserID +
      '&id=' +
      this.outTransfer.InvoiceID;
    axios
      .get(url)
      .then(responseJson => {
        console.log('responseJson', responseJson);
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
          if (status == 1) {
            this.setState({
              listOutTransferDetail: data.InvoiceDetailList,
            });
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
  _ChangeStatusOutTransfer = () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/UnPostStockOutTransfer?GUIID=' + global.GUIID;
    let body = {
      UserID: global.UserModel.UserID,
      id: this.outTransfer.InvoiceID,
    };
    axios
      .post(url, body)
      .then(responseJson => {
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
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
  _addNew_click = () => {
    this.setState({visibleAddNew: true});
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_eventrongxuat = () => {
    this.setState({visibleRongxuat: false});
  };
  _popupOK_eventrongnhan = () => {
    this.setState({visibleRongnhan: false});
  };
  _popupOK_event2 = () => {
    this.setState({visibleError: false});
    this.props.navigation.goBack();
  };
  _popupOK_eventSuccess = () => {
    this.setState({visibleSuccess: false});
    this.props.navigation.navigate('WHousetransferVC');
  };
  //Date
  _dateButton_click = () => {
    Keyboard.dismiss();
    this.setState({datePopupVisible: true});
  };

  _cancelSelectDate_event = () => {
    this.setState({datePopupVisible: false});
  };

  _okSelectDate_event = (isFrom, date) => {
    this.setState({
      datePopupVisible: false,
      dateCheck: date,
    });
  };
  //ToStock
  _ToStockButton_click = () => {
    Keyboard.dismiss();
    this.setState({tostockPopupVisible: true});
  };

  _cancelSelectToStock_event = () => {
    this.setState({tostockPopupVisible: false});
  };

  _okSelectToStock_event = tostockSelected => {
    this.setState({
      tostockPopupVisible: false,
      toStock: tostockSelected,
    });
  };
  //FromStock
  _FromStockButton_click = () => {
    Keyboard.dismiss();
    this.setState({fromstockPopupVisible: true});
  };

  _cancelSelectFromStock_event = () => {
    this.setState({fromstockPopupVisible: false});
  };

  _okSelectFromStock_event = fromstockSelected => {
    this.setState({
      fromstockPopupVisible: false,
      fromStock: fromstockSelected,
    });
  };
  _saveOutTransfer = () => {
    if (
      this.state.listOutTransferDetail.length <= 0 &&
      this.state.fromStock == null &&
      this.state.toStock == null
    ) {
      this.setState({
        visibleError: true,
        errorDescription: 'Lỗi, thông tin chưa đủ',
      });
    } else if (this.state.fromStock == null) {
      this.setState({visibleRongxuat: true});
    } else if (this.state.toStock == null) {
      this.setState({visibleRongnhan: true});
    } else if (this.state.listOutTransferDetail.length <= 0) {
      this.setState({
        visibleError: true,
        errorDescription: 'Chưa có sản phẩm nào',
      });
    } else {
      this.setState(
        {
          isChangePost: false,
        },
        () => {
          if (this.outTransfer != null) {
            this.updateStockOutTransfer();
          } else {
            this.addStockOutTransfer();
          }
        },
      );
    }
  };
  _saveandpostOutTransfer = () => {
    if (
      this.state.listOutTransferDetail.length <= 0 &&
      this.state.fromStock == null &&
      this.state.toStock == null
    ) {
      this.setState({
        visibleError: true,
        errorDescription: 'Lỗi, thông tin chưa đủ',
      });
    } else if (this.state.fromStock == null) {
      this.setState({visibleRongxuat: true});
    } else if (this.state.toStock == null) {
      this.setState({visibleRongnhan: true});
    } else if (this.state.listOutTransferDetail.length <= 0) {
      this.setState({
        visibleError: true,
        errorDescription: 'Chưa có sản phẩm nào',
      });
    } else {
      this.setState(
        {
          isChangePost: true,
        },
        () => {
          if (this.outTransfer != null) {
            this.updateStockOutTransfer();
          } else {
            this.addStockOutTransfer();
          }
        },
      );
    }
  };
  _onChangeDate = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      return;
    }
    this.setState({
      datePopupVisible: false,
      dateCheck: selectedDate,
    });
  };
  _renderCalendar = () => {
    if (Utils.isAndroid()) {
      if (this.state.datePopupVisible) {
        return (
          <DateTimePicker
            testID="dateTimePicker"
            timeZoneOffsetInMinutes={-4200}
            value={this.state.dateCheck}
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
            typePopup={true}
            value={this.state.dateCheck}
            cancelEvent={this._cancelSelectDate_event}
            okEvent={this._okSelectDate_event}
          />
        </Modal>
      );
    }
  };
  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      if (this.props.route.params.itemScan) {
        this.ItemScan = this.props.route.params.itemScan;
        this._popupOKAddnew_event2(this.ItemScan);
      }
    });
    if (this.outTransfer != null) {
      this.setState({loading: true});
      this.getStockOutTransfer();
    }
  }
  changeNotes = value => {
    this.state.note = value;
  };
  _scan_click = () => {
    this.props.navigation.navigate('CameraAddNewProductHouseTranferVC', {
      // scanComplete: this._cameraOK_event.bind(this),
    });
  };
  _back_click = () => {
    this.props.navigation.goBack();
  };
  _itemDeleted_click = item => {
    let foundIndex = this.state.listOutTransferDetail.findIndex(
      x => x.ProductID === item.ProductID,
    );
    this.state.listOutTransferDetail.splice(foundIndex, 1);
    this.setState({
      listOutTransferDetail: this.state.listOutTransferDetail,
    });
  };
  deleteRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }

    const prevIndex = this.state.listOutTransferDetail.findIndex(
      item => item.ProductID === rowKey,
    );
    let model = this.state.listOutTransferDetail[prevIndex];

    this._itemDeleted_click(model);
  };
  renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          disabled={this.state.isPost}
          style={[
            styles.backRightBtn,
            styles.backRightBtnRight,
            this.state.isPost == true ? {opacity: 0.4} : {},
          ]}
          onPress={() => this.deleteRow(rowMap, data.item.ProductID)}>
          <Text style={styles.backTextWhite}>Xoá</Text>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
          <Spinner
            visible={this.state.loading}
            textContent={'Đang tải...'}
            textStyle={{color: '#FFF'}}
          />
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.visibleSuccessAddOuttranfer}
            onTouchOutside={() => {}}>
            {/* <ModalContent> */}
            <SuccessPOP
              ErrorDescription={Language.CREATE_ADDOUTRANFER_SUCCESS}
              okEvent={this._popupOK_eventSuccess}
            />
            {/* </ModalContent> */}
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.visibleSuccessUpdateOuttranfer}
            onTouchOutside={() => {}}>
            {/* <ModalContent> */}
            <SuccessPOP
              ErrorDescription={Language.CREATE_UPDATEOUTRANFER_SUCCESS}
              okEvent={this._popupOK_eventSuccess}
            />
            {/* </ModalContent> */}
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.visibleAddNew}
            onTouchOutside={() => {
              // this.setState({ visibleAddNew: false });
            }}>
            {/* <ModalContent> */}
            <AddNewProductPOP
              cancelEvent={this._popupCancelAddnew_event}
              okEvent={this._popupOKAddnew_event}
              isTransfer={true}
            />
            {/* </ModalContent> */}
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.visibleSuccess}
            onTouchOutside={() => {}}>
            {/* <ModalContent> */}
            <SuccessPOP
              ErrorDescription={Language.CREATE_UNPOST_SUCCESS}
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
            visible={this.state.visibleRongxuat}
            onTouchOutside={() => {}}>
            {/* <ModalContent> */}
            <ErrolPOP
              ErrorDescription={Language.CHOOSE_STOCK_FROM}
              okEvent={this._popupOK_eventrongxuat}
            />
            {/* </ModalContent> */}
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.visibleRongnhan}
            onTouchOutside={() => {}}>
            {/* <ModalContent> */}
            <ErrolPOP
              ErrorDescription={Language.CHOOSE_STOCK_OUT}
              okEvent={this._popupOK_eventrongnhan}
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.tostockPopupVisible}
            onTouchOutside={() => {
              this.setState({tostockPopupVisible: false});
            }}>
            <SelectItemPOP
              value={this.state.toStock}
              cancelEvent={this._cancelSelectToStock_event}
              okEvent={this._okSelectToStock_event}
            />
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.fromstockPopupVisible}
            onTouchOutside={() => {
              this.setState({fromstockPopupVisible: false});
            }}>
            <SelectItemPOP
              value={this.state.fromStock}
              cancelEvent={this._cancelSelectFromStock_event}
              okEvent={this._okSelectFromStock_event}
            />
          </Modal>
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>Phiếu xuất chuyển kho</Text>
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
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.lable}>Số CT:</Text>
                    <Text
                      style={[
                        styles.intputextheader2,
                        this.state.isPost == true ? {opacity: 0.6} : {},
                      ]}>
                      {this.state.invoiceCode
                        ? this.state.invoiceCode
                        : 'Mã tự động có'}
                    </Text>
                  </View>
                </View>
                <View style={styles.viewDateItem}>
                  <Text style={styles.lable}>Ngày:</Text>
                  <TouchableOpacity
                    disabled={this.state.isPost}
                    style={[
                      styles.backgroudtxtdate,
                      this.state.isPost == true ? {opacity: 0.4} : {},
                    ]}
                    onPress={this._dateButton_click}>
                    <Text style={styles.lableVal}>
                      {Utils.getDayMonthYearString(this.state.dateCheck)}
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
                    disabled={this.state.isPost}
                    style={[
                      styles.backgroudtxtdate,
                      this.state.isPost == true ? {opacity: 0.4} : {},
                    ]}
                    onPress={this._FromStockButton_click}>
                    <Text style={styles.lableVal}>
                      {this.state.fromStock
                        ? this.state.fromStock.StockName
                        : 'Chọn kho'}
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
                    disabled={this.state.isPost}
                    style={[
                      styles.backgroudtxtdate,
                      this.state.isPost == true ? {opacity: 0.4} : {},
                    ]}
                    onPress={this._ToStockButton_click}>
                    <Text style={styles.lableVal}>
                      {this.state.toStock
                        ? this.state.toStock.StockName
                        : 'Chọn kho'}
                    </Text>
                    <Image
                      style={styles.imageArrow}
                      source={require('../resources/down-arrow.png')}
                    />
                  </TouchableOpacity>
                </View>
                <TextInput
                  editable={!this.state.isPost}
                  keyboardType="default"
                  style={styles.intputextheader}
                  defaultValue={this.state.note}
                  onChangeText={value => {
                    this.changeNotes(value);
                  }}
                  placeholder={Language.NOTES}
                  maxLength={100}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                {this.state.isPost == false ? (
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems:'center',
                      flexWrap: 'wrap',
                      marginBottom: 5,
                    }}>
                    <TouchableOpacity
                      onPress={this._saveOutTransfer}
                      style={styles.findButton2}>
                      <Text style={styles.textButton}>Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this._saveandpostOutTransfer}
                      style={styles.findButton}>
                      <Text style={styles.textButton}>
                        {Language.LUU_VA_GHISO}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={this._ChangeStatusOutTransfer}
                    style={styles.findButton}>
                    <Text style={styles.textButton}>Bỏ ghi sổ</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* Render list */}
            <ScrollView>
              <SwipeListView
                // isPosted = {this.state.isPost}
                style={styles.backgroudBodybody}
                data={this.state.listOutTransferDetail}
                renderItem={({item, index}) => (
                  <ItemWHouseTransferDetailCell
                    data={item}
                    index={index}
                    isPost={this.state.isPost}
                    onDeleteEvent={this._itemDeleted_click}
                  />
                )}
                keyExtractor={item => item.ProductID}
                disableRightSwipe
                renderHiddenItem={this.renderHiddenItem}
                rightOpenValue={-70}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
              />
            </ScrollView>
            <View style={styles.groupbutton}>
              <TouchableOpacity
                disabled={this.state.isPost}
                style={[
                  {marginRight: 20},
                  this.state.isPost == true ? {opacity: 0.4} : {},
                ]}
                onPress={this._scan_click}>
                <Text style={styles.textButton2}>Scans</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={this.state.isPost}
                style={[this.state.isPost == true ? {opacity: 0.4} : {}]}
                onPress={this._addNew_click}>
                <Text style={styles.textButton2}>Thêm mới</Text>
              </TouchableOpacity>
            </View>
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
    padding:5,
  },
  viewButtonDate: {
    paddingTop: 3,
    paddingLeft: 5,
    paddingRight: 8,
    flex: 2.75,
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
  lableValct: {
    fontSize: 11,
    marginRight: '4%',
    fontWeight: '700',
  },
  imageArrow: {
    width: 15,
    height: 15,
  },
  findButton: {
    marginTop:5,
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
  textButton2: {
    fontSize: 16,
    fontWeight: '600',
    color: 'blue',
    textDecorationLine: 'underline',
  },
  textButton: {
    fontWeight: '600',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  backgroudtxtdate: {
    paddingHorizontal: 6,
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
    height: 37,
    width: '96%',
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 3,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  intputextheader2: {
    marginRight:10,
    marginLeft: -20,
    height: 35,
    width: 175,
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 3,
    textAlign: 'left',
    padding:3,
    textAlignVertical: 'center',
    fontSize: 13.5,
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
    paddingRight: 20,
    width: '100%',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
  backTextWhite: {
    color: '#FFF',
  },
});
