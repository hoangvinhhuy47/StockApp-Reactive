import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';

// import Modal, { ModalContent } from 'react-native-modals';
import Language from '../resources/Language.js';

import ProductItemCell from '../cells/ProductItemCell.js';
import AddNewProductPOP from '../popup/AddNewProductPOP.js';
import EditProductPOP from '../popup/EditProductPOP.js';
import ShowDetailAddedPOP from '../popup/ShowDetailAddedPOP';
import SuccessPOP from '../popup/SuccessPOP.js';
import ErrolPOP from '../popup/ErrolPOP.js';

import {SwipeListView} from 'react-native-swipe-list-view';

import {YellowBox} from 'react-native';

YellowBox.ignoreWarnings([
  'We found non-serializable values in the navigation state',
]);

import database from '../Database.js';
import {TextInput} from 'react-native-gesture-handler';
import Utils from '../common/Utils.js';
const db = database();

export default class RequestCheckFormDetail extends Component {
  constructor(props) {
    super(props);

    this.stockSelect = this.props.route.params.stock;

    this.state = {
      visibleAddNew: false,
      visibleEdit: false,
      visibleAddDetail: false,
      arrayProduct: [],
      searchText: '',
      isSync: this.stockSelect.Status == 1 ? false : true,
      visibleSuccess: false,
      visibleSuccess2: false,
      visibleError: false,
      errorDescription:'',
    };

    //for edit product
    this.selectProduct = null;
    this.arrayProductConst = [];
  }

  componentDidMount() {
    this._getListProductStockTake();
  }

  //Button click
  _backButton_click = () => {
    this.props.navigation.pop();
  };

  _submitButton_clicked = () => {
    if (this.state.isSync) {
      this._unSyncData();
    } else {
      if (this.arrayProductConst.length == 0) {
        Utils.showAlert('Thêm chi tiết để đồng bộ');
        return;
      }
      this._syncData();
    }
  };

  _scan_click = () => {
    this.props.navigation.navigate('CameraVC', {
      stockTakeID: this.stockSelect.StockTakeID,
      scanComplete: this._cameraOK_event.bind(this),
    });
  };

  _addNew_click = () => {
    this.setState({visibleAddNew: true});
  };

  //Search text change
  _searchText_changeEvent = text => {
    if (text === '') {
      this.setState({
        arrayProduct: this.arrayProductConst,
        searchText: text,
      });
      return;
    }

    let data = this.arrayProductConst.filter(item =>
      Utils.removeAccents(item.model.SearchString)
        .toLowerCase()
        .includes(Utils.removeAccents(text).toLowerCase()),
    );
    this.setState({
      arrayProduct: data,
      searchText: text,
    });
  };

  // Cell Event
  _itemSelected_click = item => {
    this.selectProduct = item;
    this.setState({visibleAddDetail: true});
  };

  _itemEdited_click = item => {
    this.selectProduct = item;
    this.setState({visibleEdit: true});
  };

  _itemDeleted_click = item => {
    db.deleteProductStockTakeByDetailID(item.DetailID)
      .then(data => {
        this._getListProductStockTake();
      })
      .catch(err => {});

      db.deleteDetailAddProduct(this.stockSelect.StockTakeID, item.ProductID)
      .then(data => {
        this._getListProductStockTake();
      })
      .catch(err => {});
  };

  //Popup add new event
  _popupCancel_event = () => {
    this.setState({visibleAddNew: false});
    this._getListProductStockTake();
  };

  _popupOK_event = () => {
    this._getListProductStockTake();
  };
  _popupOK_event4 = () => {
    this.setState({visibleError: false});
  };
  _popupOK_eventPop = () => {
    this.setState({visibleSuccess: false});
  };
  _popupOK_eventPop2 = () => {
    this.setState({visibleSuccess2: false});
  };

  //Popup edit event
  _popupEditCancel_event = () => {
    this.setState({visibleEdit: false});
  };

  _popupEditOK_event = () => {
    this.setState({visibleEdit: false});
    this._getListProductStockTake();
  };

  //Popup add detail
  _popupAddDetailCancel_event = () => {
    this.setState({visibleAddDetail: false});
  };

  //come from camera
  _cameraOK_event = () => {
    this._getListProductStockTake();
  };

  //get data
  _getListProductStockTake = () => {
    db.getListProductStockTakeByStockTakeID(this.stockSelect.StockTakeID)
      .then(data => {
        // this.setState({ arrayProduct: [] });
        this.setState({arrayProduct: data});
        this.arrayProductConst = data;
      })
      .catch(err => {});
  };

  //sync data
  _syncData = () => {
    console.log(JSON.stringify(this.stockSelect));
    let arrObj = [];
    for (let obj of this.arrayProductConst) {
      let item = {
        DetailID: obj.model.DetailID,
        StockTakeID: obj.model.StockTakeID,
        ProductID: obj.model.ProductID,
        Barcode: obj.model.BarCode,
        ProductCode: obj.model.Code,
        ProductName: obj.model.Name,
        Quantity: Number(obj.model.Quantity),
        SortOrder: obj.model.SortOrder,
        Notes: obj.model.Note,
      };
      arrObj.push(item);
    }

    let newDate = Utils.getMonthDayYearString(
      new Date(Number(this.stockSelect.AccountingDate)),
    );
    let stockModel = {
      StockTakeID: this.stockSelect.StockTakeID,
      Name: this.stockSelect.Name,
      AccountingDate: newDate,
      StockID: this.stockSelect.StockID,
      CreatedBy: this.stockSelect.CreateBy,
      UpdateBy: this.stockSelect.UpdateBy,
      Notes: this.stockSelect.Notes,
    };

    let jsonDict = {
      StockTake: stockModel,
      StockTakeDetail: arrObj,
      UserID: global.UserModel.UserID,
    };

    console.log('JSON Post ' + JSON.stringify(jsonDict));

    let url = global.WebAPI + '/API/stock/Post?GUIID=' + global.GUIID;
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonDict),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.StatusID === 1) {
          this.setState({visibleSuccess:true})
          this.setState({
            isSync: true,
            errorDescription: responseJson.ErrorDescription,
          });
          // this.forceUpdate()
          this.stockSelect.Status = 2;
          db.updateStockTakeByID(this.stockSelect)
            .then(data => {})
            .catch(err => {});
        } else {
          if(responseJson.ErrorCode=="User_not_found"){
            Utils.saveUserModel(null);
            this.props.navigation.navigate('LoginVC');
          }else{
           this.setState({visibleError: true})
          }
        }
      })
      .catch(error => {
        Utils.showAlert('Có lỗi xảy ra. Vui lòng kiểm tra lại WebAPI!');
      });
  };

  //unsync data
  _unSyncData = () => {
    let url = global.WebAPI + '/API/stock/unpost?GUIID=' + global.GUIID;
    console.log('url: ' + url);
    console.log(
      'data: ' +
        JSON.stringify({
          StockTakeID: this.stockSelect.StockTakeID,
        }),
    );

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        StockTakeID: this.stockSelect.StockTakeID,
        UserID: global.UserModel.UserID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.StatusID === 1) {
          this.setState({visibleSuccess2: true})
          this.setState(
            {
              isSync: false,
              errorDescription: responseJson.ErrorDescription
            });
          // this.forceUpdate()
          this.stockSelect.Status = 1;
          db.updateStockTakeByID(this.stockSelect)
            .then(data => {})
            .catch(err => {});
        } else {
          if(responseJson.ErrorCode=="User_not_found"){
            Utils.saveUserModel(null);
            this.props.navigation.navigate('LoginVC');
          }else{
            this.setState({visibleError:true})
          }
        }
      })
      .catch(error => {
        Utils.showAlert('Có lỗi xảy ra. Vui lòng kiểm tra lại WebAPI!');
      });
  };

  deleteRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }

    const prevIndex = this.arrayProductConst.findIndex(
      item => item.model.DetailID === rowKey,
    );

    let model = this.arrayProductConst[prevIndex].model;
    this._itemDeleted_click(model);
  };

  renderHiddenItem = (data, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => this.deleteRow(rowMap, data.item.model.DetailID)}>
          <Text style={styles.backTextWhite}>Xoá</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={this.state.errorDescription}
          okEvent={this._popupOK_event4}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleSuccess}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <SuccessPOP
          ErrorDescription={Language.DB_TC}
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
          ErrorDescription={Language.DB_KTC}
          okEvent={this._popupOK_eventPop2}
          />
          {/* </ModalContent> */}
        </Modal>
        <View style={styles.headerView}>
          <View style={styles.viewAvatar}>
            <Image
              style={styles.avatarImage}
              source={require('../resources/avatar.png')}
            />
            <Text style={styles.headerTitle}>{global.UserModel.FullName}</Text>
          </View>
          <TouchableOpacity onPress={this._backButton_click}>
            <Image
              style={styles.headerRightButton}
              source={require('../resources/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.viewButtonSync}>
          <TouchableOpacity
            style={styles.button}
            onPress={this._submitButton_clicked}>
            <Text style={styles.textButton}>
              {this.state.isSync ? Language.CANCEL_SYNC : Language.SYNC}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={this._backButton_click}>
            <Text style={styles.textButton}>{Language.CANCEL}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 15,
            marginLeft: 15,
            marginRight: 15,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 17, fontWeight: '400'}}>{Language.FIND}</Text>
          <TextInput
            style={styles.searchText}
            returnKeyType="search"
            value={this.state.searchText}
            onChangeText={searchText =>
              this._searchText_changeEvent(searchText)
            }
          />
        </View>

        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            marginLeft: 15,
            marginRight: 15,
            marginTop: 15,
          }}>
          {this.stockSelect.Name}
        </Text>

        <SwipeListView
          data={this.state.arrayProduct}
          renderItem={({item, index}) => (
            <ProductItemCell
              data={item.model}
              index={index}
              isSync={this.state.isSync}
              onSelectItemEvent={this._itemSelected_click}
              onEditEvent={this._itemEdited_click}
              onDeleteEvent={this._itemDeleted_click}
            />
          )}
          keyExtractor={item => item.model.DetailID.toString()}
          //DetailID
          disableRightSwipe
          disableLeftSwipe={this.state.isSync}
          renderHiddenItem={this.renderHiddenItem}
          rightOpenValue={-70}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />

        <View style={styles.viewButtonScan}>
          <TouchableOpacity
            disabled={this.state.isSync ? true : false}
            style={styles.buttonBottom}
            onPress={this._scan_click}>
            <Text
              style={[
                styles.textButtonBottom,
                {color: this.state.isSync ? 'gray' : 'blue'},
              ]}>
              Scan
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={this.state.isSync ? true : false}
            style={styles.buttonBottom}
            onPress={this._addNew_click}>
            <Text
              style={[
                styles.textButtonBottom,
                {marginRight: 15, color: this.state.isSync ? 'gray' : 'blue'},
              ]}>
              Thêm mới
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleAddNew}
          onTouchOutside={() => {
            // this.setState({ visibleAddNew: false });
          }}>
          {/* <ModalContent> */}
          <AddNewProductPOP
            stockTakeID={this.stockSelect.StockTakeID}
            cancelEvent={this._popupCancel_event}
            okEvent={this._popupOK_event}
          />
          {/* </ModalContent> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleEdit}
          onTouchOutside={() => {
            // this.setState({ visibleEdit: false });
          }}>
          {/* <ModalContent> */}
          <EditProductPOP
            product={this.selectProduct}
            cancelEditEvent={this._popupEditCancel_event}
            okEditEvent={this._popupEditOK_event}
          />
          {/* </ModalContent> */}
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleAddDetail}
          onTouchOutside={() => {
            // this.setState({ visibleEdit: false });
          }}>
          {/* <ModalContent> */}
          <ShowDetailAddedPOP
            stockTakeID={this.stockSelect.StockTakeID}
            productID={
              this.selectProduct != null ? this.selectProduct.ProductID : ''
            }
            cancelEvent={this._popupAddDetailCancel_event}
          />
          {/* </ModalContent> */}
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  },
  viewButtonSync: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginRight: 15,
  },
  headerRightButton: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  button: {
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  searchText: {
    height: 30,
    borderColor: 'black',
    borderWidth: 0.5,
    borderRadius: 3,
    marginLeft: 10,
    flex: 1,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  viewButtonScan: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'black',
  },
  buttonBottom: {
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  textButtonBottom: {
    fontSize: 18,
    fontWeight: '400',
    textDecorationLine: 'underline',
  },

  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    // backgroundColor: '#DDD',
    flex: 1,
    // width: '100%',
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
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 16,
  },
});
