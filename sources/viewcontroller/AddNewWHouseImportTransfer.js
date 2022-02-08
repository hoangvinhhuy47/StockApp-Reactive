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
  Platform,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {SwipeListView} from 'react-native-swipe-list-view';
import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';
import SelectDatePOP from '../popup/SelectDatePOP.js';
import ErrolPOP from '../popup/ErrolPOP.js';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import ItemWHouseImportTransferDetailCell from '../cells/ItemWHouseImportTransferDetailCell.js';
import SuccessPOP from '../popup/SuccessPOP.js';
import AddNewProductPOP from '../popup/AddNewProductPOP.js';
import Database from '../Database.js';
const db = database();
import DateTimePicker from '@react-native-community/datetimepicker';
import Autocomplete from 'react-native-autocomplete-input';
export default class AddNewWHouseImportTransfer extends Component {
  constructor(props) {
    super(props);
    this.InvoiceCodeScan = '';
    this.inTransfer = this.props.route.params.InTransfer;

    this.ItemScan = '';
    if (this.inTransfer != null) {
      // detail
      this.state = {
        isFinishInvoice: true,
        listOutTransfer: [],
        listInTransferDetail: [],
        datePopupVisible: false,
        visibleError: false,
        visibleError2: false,
        visibleSuccess: false,
        visibleSuccessUpdateOuttranfer: false,
        visibleSuccessAddOuttranfer: false,
        visibleAddNew: false,
        visibleRongxuat: false,
        visibleRongnhan: false,
        loading: false,
        dateCheck: new Date(this.inTransfer.AccountingDate),
        invoiceCode: this.inTransfer.InvoiceCode,
        invoiceID: this.inTransfer.InvoiceID,
        toStock: null,
        fromStock: null,
        refID: this.inTransfer.RefID,
        refCode: this.inTransfer.RefCode,
        note: this.inTransfer.Notes,
        isPost: this.inTransfer.IsPosted,
        isChangePost: false,
        films: []
      };
      db.getStockById(this.inTransfer.FromStockID)
        .then(result => {
          this.setState({fromStock: result});
        })
        .catch(err => {});
      db.getStockById(this.inTransfer.ToStockID)
        .then(result => {
          this.setState({toStock: result});
        })
        .catch(err => {});
    } else {
      //add new
      this.state = {
        isFinishInvoice: true,
        listOutTransfer: [],
        listInTransferDetail: [],
        datePopupVisible: false,
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
        invoiceID: '',
        refID: '',
        refCode: '',
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

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      if (this.props.route.params.itemScan) {
        this.ItemScan = this.props.route.params.itemScan;
        this._popupOKAddnew_event(this.ItemScan);
      }
      if (this.props.route.params.InTransferScan) {
        this.InTransferScan = this.props.route.params.InTransferScan;
        this._cameraOK_event(this.InTransferScan);
      }

      this.quickSearchStockOutTransfer();
    });
    if (this.inTransfer != null) {
      this.setState({loading: true});
      this.getStockInTransfer();
    }
  }
  //Popup add new event
  _popupCancelAddnew_event = () => {
    this.setState({visibleAddNew: false});
  };
  _popupOKAddnew_event = listItem => {
    const tempData = this.state.listInTransferDetail;
    let _addList = [];
    for (let i = 0; i < listItem.length; i++) {
      let item = listItem[i];
      let found = this.state.listInTransferDetail.find(
        x => x.ProductID == item.ProductID,
      );
      if (found) {
        found.Quantity += item.Quantity;
      } else {
        (item.InvoiceID = ''),
          (item.InvoiceDetailID = ''),
          (item.SortOrder = 1);

        // _addList.push(item)
      }
    }
    const list = [...tempData].concat(_addList);
    this.setState(
      {
        listInTransferDetail: [...list],
      },
      () => {
        console.log(this.state.listInTransferDetail);
      },
    );
  };
  getStockInTransfer = async () => {
    let url =
      global.WebAPI +
      '/API/stock/GetStockInTransferById?GUIID=' +
      global.GUIID +
      '&userId=' +
      global.UserModel.UserID +
      '&Id=' +
      this.inTransfer.InvoiceID;
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
              listInTransferDetail: data.InvoiceDetailList,
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
  addStockInTransfer = async () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/AddStockInTransfer?GUIID=' + global.GUIID;
    let body = {
      IsFinishInvoice: this.state.isFinishInvoice,
      UserID: global.UserModel.UserID,
      IsPost: this.state.isChangePost,
      InvoiceMaster: {
        InvoiceID: '',
        InvoiceCode: '',
        Notes: this.state.note,
        AccountingDate: Utils.getDateTimeFormatToAPI(this.state.dateCheck),
        FromStockID: this.state.fromStock.StockID,
        ToStockID: this.state.toStock.StockID,
        FromStockName: this.state.fromStock.StockName,
        ToStockName: this.state.toStock.StockName,
        RefID: this.state.refID,
        RefCode: this.state.refCode,
        IsPosted: this.state.isPost,
        StatusName: '',
      },
      InvoiceMasterDetailList: this.state.listInTransferDetail,
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
  updateStockInTransfer = async () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/UpdateStockInTransfer?GUIID=' + global.GUIID;
    let body = {
      IsFinishInvoice: this.state.isFinishInvoice,
      UserID: global.UserModel.UserID,
      IsPost: this.state.isChangePost,
      InvoiceMaster: {
        InvoiceID: this.inTransfer.InvoiceID,
        Notes: this.state.note,
        InvoiceCode: this.inTransfer.InvoiceCode,
        AccountingDate: this.state.dateCheck,
        FromStockID: this.state.fromStock.StockID,
        ToStockID: this.state.toStock.StockID,
        FromStockName: this.state.fromStock.StockName,
        ToStockName: this.state.toStock.StockName,
        IsPosted: this.state.isPost,
        RefID: this.inTransfer.RefID,
        RefCode: this.inTransfer.RefCode,
        RefType: this.inTransfer.RefType,
        EmployeeID: this.inTransfer.EmployeeID,
        EmployeeName: this.inTransfer.EmployeeName,
        StatusName: this.inTransfer.StatusName,
      },
      InvoiceMasterDetailList: this.state.listInTransferDetail,
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
  _ChangeStatusInTransfer = () => {
    this.setState({
      loading: true,
    });
    let url =
      global.WebAPI + '/API/stock/UnPostStockInTransfer?GUIID=' + global.GUIID;
    let body = {
      UserID: global.UserModel.UserID,
      id: this.inTransfer.InvoiceID,
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
  quickSearchStockOutTransfer = async () => {
    let url =
      global.WebAPI +
      '/API/stock/QuickSearchStockOutTransfer?GUIID=' +
      global.GUIID +
      '&userId=' +
      global.UserModel.UserID +
      '&searchString=' +
      this.state.invoiceCode;
    axios
      .get(url)
      .then(responseJson => {
        console.log('responseJson', responseJson);
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
          for (let i in data.InvoiceList) {
            data.InvoiceList[i].RefID = data.InvoiceList[i].InvoiceID;
            data.InvoiceList[i].RefCode = data.InvoiceList[i].InvoiceCode;
          }
          if (status == 1) {
            this.setState({
              listOutTransfer: data.InvoiceList,
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
    this.props.navigation.navigate('WHouseImportTransferVC');
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
  changeNotes = value => {
    this.state.note = value;
  };
  changeCodes = value => {
    this.state.invoiceCode = value;
  };
  _scanProduct_click = () => {
    if (this.state.listInTransferDetail.length > 0) {
      this.props.navigation.navigate(
        'CameraScanProductImportHouseTransferVC',
        {},
      );
    } else {
      this.setState({
        visibleError: true,
        errorDescription: 'Bạn hãy chọn phiếu xuất chuyển kho trước!',
      });
    }
  };
  _back_click = () => {
    this.props.navigation.navigate('WHouseImportTransferVC');
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
          ]}>
          <Text style={styles.backTextWhite}>Xoá</Text>
        </TouchableOpacity>
      </View>
    );
  };
  _handleAutocompleteItem_clicked = item => {
    db.getStockById(item.FromStockID)
      .then(result => {
        this.setState({fromStock: result});
      })
      .catch(err => {});
    db.getStockById(item.ToStockID)
      .then(result => {
        this.setState({toStock: result});
      })
      .catch(err => {});
    this.setState({
      invoiceCode: item.InvoiceCode,
      dateCheck: new Date(item.AccountingDate),
      note: item.Notes,
      invoiceID: item.InvoiceID,
      refID: item.InvoiceID,
      refCode: item.InvoiceCode,
      films: []
    });
    this.getStockOutTransfer(item);
  };
  getStockOutTransfer = async item => {
    let url =
      global.WebAPI +
      '/API/stock/GetStockOutTransferById?GUIID=' +
      global.GUIID +
      '&userId=' +
      global.UserModel.UserID +
      '&id=' +
      item.InvoiceID;
    axios
      .get(url)
      .then(responseJson => {
        console.log('responseJson', responseJson);
        if (responseJson.status == 200) {
          let data = responseJson.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
          for (let i in data.InvoiceDetailList) {
            data.InvoiceDetailList[i].QuantityRefInvoice =
              data.InvoiceDetailList[i].Quantity;
            data.InvoiceDetailList[i].Quantity = 0;
            data.InvoiceDetailList[i].QuantityInventory = 0;
            data.InvoiceDetailList[i].RefDetailID =
              data.InvoiceDetailList[i].InvoiceDetailID;
            data.InvoiceDetailList[i].InvoiceDetailID = '';
          }
          if (status == 1) {
            this.setState({
              listInTransferDetail: data.InvoiceDetailList,
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

  //Autocomplete
  findFilm(query) {
    if (query === '') {
      return []
    }
    if (this.inTransfer != null) {
      query = Utils.removeAccents(query.toString()).toLowerCase();

      const data = this.state.listOutTransfer;
      let result = data.filter(item => {
        let searchStringO = Utils.removeAccents(
          item.RefCode.toString(),
        ).toLowerCase();
        let result = searchStringO.indexOf(query) > 1;
        return result;
      });

      return result;
    } else {
      query = Utils.removeAccents(query.toString()).toLowerCase();

      const data = this.state.listOutTransfer;
      let result = data.filter(item => {
        let searchStringO = Utils.removeAccents(
          item.RefCode.toString(),
        ).toLowerCase();
        let result = searchStringO.indexOf(query) > 1;
        return result;
      });

      return result;
    }

    //  else {
    //   return this.state.listOutTransfer;
    // }
  }
  _cameraOK_event = item => {
    db.getStockById(item.InvoiceMaster.FromStockID)
      .then(result => {
        this.setState({fromStock: result});
      })
      .catch(err => {});
    db.getStockById(item.InvoiceMaster.ToStockID)
      .then(result => {
        this.setState({toStock: result});
      })
      .catch(err => {});
    for (let _item in item.InvoiceDetailList) {
      item.InvoiceDetailList[_item].QuantityRefInvoice =
        item.InvoiceDetailList[_item].Quantity;
      item.InvoiceDetailList[_item].Quantity = 0;
      item.InvoiceDetailList[_item].QuantityInventory = 0;
      item.InvoiceDetailList[_item].RefDetailID =
        item.InvoiceDetailList[_item].InvoiceDetailID;
      item.InvoiceDetailList[_item].InvoiceDetailID = '';
    }
    this.setState({
      invoiceCode: item.InvoiceMaster.InvoiceCode,
      dateCheck: new Date(item.InvoiceMaster.AccountingDate),
      note: item.InvoiceMaster.Notes,
      invoiceID: item.InvoiceMaster.InvoiceID,
      refID: item.InvoiceMaster.InvoiceID,
      refCode: item.InvoiceMaster.InvoiceCode,
      note: item.InvoiceMaster.Notes,
      listInTransferDetail: item.InvoiceDetailList,
    });
  };
  _ScanOutTransfer = () => {
    this.props.navigation.push('CameraScanOutTransfer');
  };
  _saveInTransfer = () => {
    let find = this.state.listInTransferDetail.find(x => x.Quantity > 0);
    let finds = this.state.listInTransferDetail.find(
      x => x.Quantity > x.QuantityRefInvoice - x.QuantityInventory,
    );
    if (!find || finds) {
      this.setState({
        visibleError: true,
        errorDescription: 'Số lượng nhận không hợp lệ!',
      });
    } else if (this.state.listInTransferDetail.length <= 0) {
      this.setState({
        visibleError: true,
        errorDescription: 'Bạn chưa chọn phiếu xuất!',
      });
    } else {
      this.setState(
        {
          isChangePost: false,
        },
        () => {
          if (this.inTransfer != null) {
            this.updateStockInTransfer();
          } else {
            this.addStockInTransfer();
          }
        },
      );
    }
  };
  _saveandpostInTransfer = () => {
    let find = this.state.listInTransferDetail.find(x => x.Quantity == 0);
    let finds = this.state.listInTransferDetail.find(
      x => x.Quantity > x.QuantityRefInvoice - x.QuantityInventory,
    );
    if (find || finds) {
      this.setState({
        visibleError: true,
        errorDescription: 'Số lượng nhận không hợp lệ!',
      });
    } else if (this.state.listInTransferDetail.length <= 0) {
      this.setState({
        visibleError: true,
        errorDescription: 'Bạn chưa chọn phiếu xuất!',
      });
    } else {
      this.setState(
        {
          isChangePost: true,
        },
        () => {
          if (this.inTransfer != null) {
            this.updateStockInTransfer();
          } else {
            this.addStockInTransfer();
          }
        },
      );
    }
  };
  checkBoxFinishInvoice = () => {
    this.setState({isFinishInvoice: !this.state.isFinishInvoice});
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
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>Phiếu nhập chuyển kho</Text>
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
                  <View
                    style={{
                      top: 5,
                      zIndex: 999,
                      position: 'absolute',
                      flexDirection: 'row',
                    }}>
                    <Autocomplete
                      autoCapitalize="none"
                      autoCorrect={false}
                      data={this.state.films}
                      editable={!this.state.isPost}
                      listStyle={{maxHeight: 180, width: '100%'}}
                      style={styles.intputextheader1}
                      containerStyle={{
                        backgroundColor: '#e6faf3',
                      }}
                      autoFocus={false}
                      defaultValue={this.state.refCode}
                      onChangeText={text => {
                        this.setState({refCode: text,
                        films: this.findFilm(text)
                        })
                      }}
                      placeholder={Language.CT_XUAT}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: 'gray',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                          }}
                          onPress={() =>
                            this._handleAutocompleteItem_clicked(item)
                          }>
                          <View style={{marginBottom: 5}}>
                            <Text style={styles.Txt2}>{item.RefCode}</Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row', 
                              alignItems: 'center',
                            }}>
                            <Text style={styles.Txt}>{item.FromStockName}</Text>
                            <Image
                              style={styles.imageArrow2}
                              source={require('../resources/right-arrow.png')}
                            />
                            <Text style={styles.Txt3}>{item.ToStockName}</Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      keyExtractor={item => item.RefID.toString()}
                    />
                    <TouchableOpacity
                      disabled={this.state.isPost}
                      onPress={this._ScanOutTransfer}
                      style={[
                        styles.ScanButton,
                        this.state.isPost == true ? {opacity: 0.4} : {},
                      ]}>
                      <Image
                        style={styles.imageScan}
                        source={require('../resources/icons8_qr.png')}
                      />
                    </TouchableOpacity>
                  </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 40,
                    flexWrap: 'wrap',
                  }}>
                  {this.inTransfer != null ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 5,
                      }}>
                      <Text style={styles.lable2}>Số CT:</Text>
                      <Text style={styles.intputextheader2}>
                        {this.inTransfer.InvoiceCode}
                      </Text>
                    </View>
                  ) : (
                    <View />
                  )}
                  <View style={styles.viewDateItem2}>
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
                    <View
                      style={[
                        styles.backgroudtxtdate,
                        this.state.isPost == true ? {opacity: 0.4} : {},
                      ]}>
                      <Text style={styles.lableVal}>
                        {this.state.fromStock
                          ? this.state.fromStock.StockName
                          : ''}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.viewDateItem3}>
                    <Text style={styles.lable}>
                      {Language.RECEIVING_WAREHOUSE + ':'}
                    </Text>
                    <View
                      style={[
                        styles.backgroudtxtdate,
                        this.state.isPost == true ? {opacity: 0.4} : {},
                      ]}>
                      <Text style={styles.lableVal}>
                        {this.state.toStock ? this.state.toStock.StockName : ''}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 3,
                    }}>
                     {
                     Platform.OS === 'ios' ?
                        <CheckBox
                          boxType = "square"
                          disabled={this.state.isPost}
                          value={this.state.isFinishInvoice}
                          onChange={() => this.checkBoxFinishInvoice()}
                        />
                      :
                      <CheckBox
                        disabled={this.state.isPost}
                        value={this.state.isFinishInvoice}
                        onChange={() => this.checkBoxFinishInvoice()}
                      />
                    }
                    <Text
                      style={[
                        {fontSize: 15, color: '#000', paddingLeft:10 },
                        this.state.isPost == true ? {opacity: 0.4} : {},
                      ]}>
                      Hoàn tất chứng từ chuyển kho
                    </Text>
                  </View>
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
                  paddingTop: 10,
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                }}>
                {this.state.isPost == false ? (
                  <View
                    style={{
                      justifyContent: 'center',
                      width: '100%',
                      justifyContent: 'space-between',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      marginBottom: 5,
                    }}>
                    <TouchableOpacity
                      // disabled={this.state.isPost}
                      onPress={this._saveInTransfer}
                      style={styles.findButton2}>
                      <Text style={styles.textButton}>Lưu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      // disabled={this.state.isPost}
                      onPress={this._saveandpostInTransfer}
                      style={styles.findButton}>
                      <Text style={styles.textButton}>
                        {Language.LUU_VA_GHISO}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    // disabled={!this.state.isPost}
                    onPress={this._ChangeStatusInTransfer}
                    style={styles.findButton}>
                    <Text style={styles.textButton}>Bỏ ghi sổ</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {/* Render list */}
            <ScrollView>
              <SwipeListView
                style={styles.backgroudBodybody}
                data={this.state.listInTransferDetail}
                renderItem={({item, index}) => (
                  <ItemWHouseImportTransferDetailCell
                    data={item}
                    index={index}
                    isPost={this.state.isPost}
                    // onDeleteEvent={this._itemDeleted_click}
                  />
                )}
                keyExtractor={item => item.ProductID}
                // disableRightSwipe
                // renderHiddenItem={this.renderHiddenItem}
                // rightOpenValue={-70}
                // previewRowKey={'0'}
                // previewOpenValue={-40}
                // previewOpenDelay={3000}
              />
            </ScrollView>
            <View style={styles.groupbutton}>
              <TouchableOpacity
                disabled={this.state.isPost}
                style={[this.state.isPost == true ? {opacity: 0.4} : {}]}
                onPress={this._scanProduct_click}>
                <Text style={styles.textButton2}>Scans</Text>
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
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
  },
  viewButtonDate: {
    paddingLeft: 5,
    paddingRight: 8,
    flex: 2.75,
  },
  viewDateItem: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  viewDateItem3: {
    marginBottom: 2,
    flexDirection: 'row',
  },
  viewDateItem2: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  lable: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    width: 80,
  },
  lable2: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    width: 65,
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
    // marginRight: 6,
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
    height: 35,
    width: '96%',
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingVertical: 0,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  intputextheader2: {
    height: 32,
    width: 190,
    paddingLeft: 5,
    borderColor: 'gray',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingVertical: 0,
    marginRight: 10,
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
    width: 25,
    height: 25,
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
  intputextheader1: {
    height: 30,
    width: 202,
    paddingLeft: 5,
    paddingVertical: 0,
    backgroundColor: 'white',
    zIndex:9999
  },
  ScanButton: {
    right: 0,
    marginRight: 5,
    marginLeft: 3,
    width: 30,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fff',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 5,
    // marginRight: 6,
  },
  Txt: {
    fontStyle: 'italic',
    fontSize: 15,
  },
  Txt2: {
    fontWeight: '700',
    fontStyle: 'italic',
    fontSize: 15,
  },
  imageArrow2: {
    marginHorizontal: 5,
    width: 10,
    height: 10,
  },
});