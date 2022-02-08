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
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';
import {SwipeListView} from 'react-native-swipe-list-view';
import ErrolPOP from '../popup/ErrolPOP.js';
import ErrorPOP2 from '../popup/ErrorPOP2.js';
import SuccessPOP from '../popup/SuccessPOP.js';
import ItemCheckOrderDetailCell from '../cells/ItemCheckOrderDetailCell.js';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import { beginAsyncEvent } from 'react-native/Libraries/Performance/Systrace';
export default class RequestCheckFormDetail extends Component {
  constructor(props) {
    super(props);
    this.order = this.props.route.params.Order;
    this.isCamera = this.props.route.params?.isCamera;
    this.state = {
      ListOrderDetail: [],
      loading: false,
      visibleError: false,
      visibleError2: false,
      visibleSuccess: false,
      errorDescription: '',
      orderReturnType: this.order.OrderReturnType,
    };
  }
  toggleModal(visible) {
    this.setState({modalVisible: visible});
  }
  getData = async id => {
    this.setState({loading: true});
    let url =
      global.WebAPI +
      '/API/stock/getOrderById?GUIID=' +
      global.GUIID +
      '&orderId=' +
      this.order.OrderID +
      '&userId=' +
      global.UserModel.UserID;

    axios
      .get(url)
      .then(response => {
        if (response.status == 200) {
          let data = response.data;
          let status = data.StatusID;
          this.setState({
            errorDescription: data.ErrorDescription,
          });
          if (status == 1) {
            this.setState({
              ListOrderDetail: data.OrderDetailList,
            });
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
  componentDidMount() {
    if (this.isCamera) {
      let order = this.order;
      this.order = order.Order;
      this.setState({
        orderReturnType: order.Order.OrderReturnType,
        ListOrderDetail: order.OrderDetailList,
      });
    } else {
      this.props.navigation.addListener('focus', () => {
        this.getData();
      });
    }
  }

  _accept = (_this) => {
    _this.setState({loading: true});
    let body = {
      UserID: global.UserModel.UserID,
      Order: _this.order,
      OrderDetailList: _this.state.ListOrderDetail,
    };
    let url = global.WebAPI + '/API/stock/UpdateOrder?GUIID=' + global.GUIID;
    axios
      .post(url, body)
      .then(response => {
        if (response.status == 200) {
          let data = response.data;
          let status = data.StatusID;
          this.setState({errorDescription: data.ErrorDescription});
          if (status == 1) {
            this.setState({visibleSuccess: true});
          } else {
            if(data.ErrorCode=="User_not_found"){
              Utils.saveUserModel(null);
              this.props.navigation.navigate('LoginVC');
            }else{
              this.setState({visibleError: true});
            }
          }

          _this.setState({
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
  _back_click = () => {
    // this.props.navigation.goBack();
    this.props.navigation.navigate('CheckYourOrderVC');
  };
  _nameNUll = item => {
    if (item == null) {
      return '                    ';
    } else {
      return item;
    }
  };
  changeQuantity = item => {
    console.log('itemmmm', item);
    let index = this.state.ListOrderDetail.findIndex(
      ({OrderDetailID}) => OrderDetailID === item.OrderDetailID,
    );
    item.Quantity = parseFloat(item.Quantity);
    this.state.ListOrderDetail?.splice(index, 1, item);
    this.setState({
      ListOrderDetail: this.state.ListOrderDetail,
    });
  };
  //Popup add new event
  _popupCancel_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_eventSuccess = () => {
    this.setState({visibleSuccess: false});
    this.props.navigation.navigate('CheckYourOrderVC');
  };
  _popupOK_event = () => {
    this.setState({visibleError: false});
  };
  _popupOK_event2 = () => {
    this.setState({visibleError2: false});
    this.props.navigation.goBack();
  };
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleSuccess}
          onTouchOutside={() => {}}>
          {/* <ModalContent> */}
          <SuccessPOP
            ErrorDescription={Language.CREATE_UPDATE_ORDER_SUCCESS}
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
            {Language.ADD_NEW_CHECKORDER_TITLE_DETAIL}
          </Text>
          <TouchableOpacity onPress={this._back_click}>
            <Image
              style={styles.buttonLogout}
              source={require('../resources/close.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.containerBody}>
          <View style={styles.containerBodyheader}>
            <View style={styles.grouptexthd1}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={styles.IMG}
                  source={require('../resources/request.png')}
                />
                <Text style={styles.txt_text2}>{this.order.OrderCode}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={styles.IMG}
                  source={require('../resources/calendar.png')}
                />
                <Text style={styles.txt_text3}>
                  {Utils.getDayMonthYearHourStringDetail(this.order.AccountingDate)}
                </Text>
              </View>
            </View>
            <View style={styles.grouptexthd3}>
              <Text style={styles.txt_text3}>
                [{this.order.CustomerCode}] _{' '}
              </Text>
              <Text style={styles.txt_text4}>{this.order.CustomerName}</Text>
            </View>
            <View style={styles.grouptexthd1}>
              <View style={styles.grouptexthd}>
                <Text style={styles.txt_text3}>NV: </Text>
                <Text style={styles.txt_text4}>
                  {this._nameNUll(this.order.CreatedName)}
                </Text>
              </View>
              <View style={styles.grouptexthd}>
                <Text style={styles.txt_text3}>GH: </Text>
                <Text style={styles.txt_text4}>
                  {this._nameNUll(this.order.ShipperName)}
                </Text>
              </View>
            </View>
          </View>
          <ScrollView>
            <FlatList
              style={styles.backgroudBodybody}
              data={this.state.ListOrderDetail}
              renderItem={({item, index}) => (
                <ItemCheckOrderDetailCell
                  data={item}
                  index={index}
                  orderReturnType = {this.state.orderReturnType}
                  //   onPressItem={this._itemSelected_click}
                  // editCheckPressed={this._editCheckPressed}
                  // deleteCheckPressed={this._deleteCheckPressed}
                  changeQuantity={this.changeQuantity}
                />
              )}
              keyExtractor={item => item.ProductID}
            />
          </ScrollView>
          <View style={styles.groupbutton}>
            <TouchableOpacity
              onPress={this._back_click}
              style={styles.findButtonexit}>
              <Text style={styles.textButton2}>Đóng</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this._accept(this)} style={styles.findButton}>
              <Text style={styles.textButton}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerView: {
    backgroundColor: 'white',
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
    fontSize: 17,
    fontWeight: '600',
    marginLeft: '2%',
  },
  buttonLogout: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  IMG: {
    width: 15,
    height: 15,
    marginRight: 6,
    marginTop: 3,
  },
  IMG2: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  containerBody: {
    flex: 1,
    marginBottom: 10,
  },
  containerBodyheader: {
    padding: 10,
    height: 100,
    backgroundColor: '#e6faf3',
    justifyContent: 'space-between',
    borderBottomColor: '#000',
    borderBottomWidth: 0.5,
    borderRadius: 3,
  },
  grouptexthd: {
    flexDirection: 'row',
  },
  grouptexthd3: {
    flexDirection: 'row',
    marginLeft: 2,
  },
  grouptexthd1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt_text2: {
    fontStyle: 'italic',
    fontSize: 15,
    color: 'black',
    fontWeight: '700',
  },
  txt_text4: {
    fontSize: 15,
    color: 'black',
    fontStyle: 'italic',
    textTransform: 'capitalize',
  },
  txt_text3: {
    fontStyle: 'italic',
    fontSize: 15,
    color: 'black',
  },
  txt_text: {
    fontSize: 15,
    color: 'black',
  },
  backgroudBodybody: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    marginTop: '0.5%',
  },
  groupbutton: {
    width: '100%',
    height: 40,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  findButton: {
    marginTop: 8,
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    width: 130,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  findButtonexit: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5EB45F',
    width: 130,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButton: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  textButton2: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#999999',
  },
});
