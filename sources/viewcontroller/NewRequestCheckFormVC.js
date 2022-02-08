import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import Database from '../Database.js';
const db = database();

import SelectDatePOP from '../popup/SelectDatePOP.js';
import SelectItemPOP from '../popup/SelectItemPOP.js';
import SuccessPOP from '../popup/SuccessPOP.js';
import ErrolPOP from '../popup/ErrolPOP.js';

import {StockTakeModel} from '../models/StockTakeModel.js';

import DateTimePicker from '@react-native-community/datetimepicker';

export default class NewRequestCheckFormVC extends Component {
  constructor(props) {
    super(props);
    this.checkForm = this.props.route.params.checkForm;
    if (this.checkForm != null) {
      //edit
      this.state = {
        datePopupVisible: false,
        stockPopupVisible: false,
        dateCheck: new Date(Number(this.checkForm.AccountingDate)),
        name: this.checkForm.Name,
        stock: null,
        description: this.checkForm.Notes,
        visibleSuccess: false,
        visibleSuccess2: false,
        visibleError: false,
      visibleError2: false,
      };

      db.getStockById(this.checkForm.StockID)
        .then(result => {
          this.setState({stock: result});
        })
        .catch(err => {});
    } else {
      // add new
      this.state = {
        datePopupVisible: false,
        stockPopupVisible: false,
        dateCheck: new Date(),
        name: '',
        stock: null,
        description: '',
        visibleSuccess: false,
        visibleSuccess2: false,
        visibleError: false,
      visibleError2: false,
      };
    }

    this.isFromDate = true;
  }

  _back_click = () => {
    this.props.navigation.goBack();
  };

  _submit_click = () => {
    Keyboard.dismiss();
    if (this.state.name == '') {
      Utils.showAlert(Language.INPUT_CHECK_FORM_NAME);
      return;
    }

    if (this.state.stock == null) {
      Utils.showAlert(Language.CHOOSE_STOCK);
      return;
    }

    let stringDate = Date.parse(this.state.dateCheck).toString();

    if (this.checkForm != null) {
      //edit Check Form

      this.checkForm.Name = this.state.name;
      this.checkForm.AccountingDate = stringDate;
      this.checkForm.StockID = this.state.stock.StockID;
      this.checkForm.StockName = this.state.stock.StockName;
      this.checkForm.Notes = this.state.description;
      this.checkForm.UpdateBy = global.UserModel.UserID;

      db.updateStockTakeByID(this.checkForm)
        .then(result => {
          this.setState({visibleSuccess: true})
        })
        .catch(err => {
          this.setState({visibleError: true})
        });

      return;
    }

    //add new check form
    let model = new StockTakeModel();
    model.StockTakeID = Utils.guidGenerator();
    model.Name = this.state.name;
    model.AccountingDate = stringDate;
    model.StockID = this.state.stock.StockID;
    model.StockName = this.state.stock.StockName;
    model.Notes = this.state.description;
    model.CreateBy = global.UserModel.UserID;
    model.UpdateBy = '';
    model.Status = 1;

    db.addStockTake(model)
      .then(result => {
        this.setState({visibleSuccess2: true})
      })
      .catch(err => {
        this.setState({visibleError2: true})
      });
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
  _popupOK_event = () => {
    this.setState({visibleSuccess: false}, () => {
      this.props.navigation.goBack();
    });
  };
  _popupOK_event2 = () => {
    this.setState({visibleSuccess2: false}, () => {
      this.props.navigation.goBack();
    });
  };
  _popupOK_event3 = () => {
    this.setState({visibleError: false});
  };
  _popupOK_event4 = () => {
    this.setState({visibleError2: false});
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

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={Language.UPDATE_CHECK_FORM_FAIL}
          okEvent={this._popupOK_event3}
          />
          {/* </ModalContent> */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visibleError2}
          onTouchOutside={() => {
          }}>
          {/* <ModalContent> */}
          <ErrolPOP
          ErrorDescription={Language.CREATE_CHECK_FORM_FAIL}
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
          ErrorDescription={Language.UPDATE_CHECK_FORM_SUCCESS}
          okEvent={this._popupOK_event}
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
          ErrorDescription={Language.CREATE_CHECK_FORM_SUCCESS}
          okEvent={this._popupOK_event2}
          />
          {/* </ModalContent> */}
        </Modal>
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>
              {Language.ADD_NEW_CHECK_TITLE}
            </Text>
            <TouchableOpacity onPress={this._back_click}>
              <Image
                style={styles.buttonLogout}
                source={require('../resources/close.png')}
              />
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            enabled>
            <View style={[styles.viewItem, {marginTop: 20}]}>
              <Text style={styles.label}>{Language.NAME_FORM}</Text>
              <TextInput
                style={styles.textInput}
                underlineColorAndroid="transparent"
                value={this.state.name}
                onChangeText={name => this.setState({name})}
              />
            </View>
            <View style={styles.viewItem}>
              <Text style={styles.label}>{Language.DATE_CHECK}</Text>
              <TouchableOpacity
                style={styles.viewInput}
                onPress={this._dateButton_click}>
                <Text style={styles.labelValue}>
                  {Utils.getDayMonthYearString(this.state.dateCheck)}
                </Text>
                <Image
                  style={styles.arrow}
                  source={require('../resources/down-arrow.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.viewItem}>
              <Text style={styles.label}>{Language.STORE_CHECK}</Text>
              <TouchableOpacity
                style={styles.viewInput}
                onPress={this._stockButton_click}>
                <Text style={styles.labelValue}>
                  {this.state.stock ? this.state.stock.StockName : ''}
                </Text>
                <Image
                  style={styles.arrow}
                  source={require('../resources/down-arrow.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.viewDescription}>
              <Text style={styles.label}>{Language.DESCRIPTION}</Text>
              <TextInput
                multiline
                numberOfLines={4}
                style={[styles.textDescription, {textAlignVertical: 'top'}]}
                value={this.state.description}
                onChangeText={description => this.setState({description})}
              />
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity
                style={styles.findButtonexit}
                onPress={this._back_click}>
                <Text style={styles.textButton2}>{Language.CANCEL}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={this._submit_click}>
                <Text style={styles.textButton}>{Language.OK}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

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
              cancelEvent={this._cancelSelectStock_event}
              okEvent={this._okSelectStock_event}
            />
          </Modal>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
  },
  buttonLogout: {
    width: 20,
    height: 20,
    marginRight: 20,
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 20,
    height: 50,
  },
  viewDescription: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  textDescription: {
    width: '100%',
    height: 150,
    borderColor: 'black',
    borderWidth: 0.5,
    marginTop: 10,
    borderRadius: 3,
    paddingLeft: 5,
  },
  label: {
    fontSize: 18,
  },
  labelValue: {
    color: 'black',
    fontSize: 18,
  },
  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 200,
  },
  textInput: {
    width: 200,
    height: 30,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  arrow: {
    width: 20,
    height: 20,
  },
  viewButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#5EB45F',
    borderWidth: 1,
    borderColor: '#20A422',
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  findButtonexit: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5EB45F',
    width: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  textButton2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999999',
  },
});
