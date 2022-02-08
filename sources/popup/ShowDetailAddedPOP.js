import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';

import Language from '../resources/Language.js';
import Utils from '../common/Utils.js';

import database from '../Database.js';
const db = database();

class DetailProductCell extends Component {

  render() {
    return (
      <View
        style={{
          width: '100%',
        }}>
        <View style={{flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between', padding: 10,}}>
          <Text style={{width: '15%'}}>{this.props.index + 1}</Text>
          <Text style={{width: '58%'}} numberOfLines={2}>
            {this.props.data.Name}
          </Text>
          <Text style={{width: '20%', textAlign: 'right'}}>
            {this.props.data.Quantity}
          </Text>
        </View>
        <View style={{height: 0.5,
    backgroundColor: 'gray',}} />
      </View>
    );
  }
}

export default class ShowDetailAddedPOP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrayData: [],
    };
  }

  componentDidMount() {
    db.getListDetailAddProduct(this.props.stockTakeID, this.props.productID)
      .then(data => {
        this.setState({arrayData: data});
      })
      .catch(err => {});
  }

  //Handle action
  _cancelButton_clicked = () => {
    this.props.cancelEvent();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerItem}>
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>{Language.DETAIL}</Text>
            <TouchableOpacity onPress={this._cancelButton_clicked}>
              <Image
                style={styles.buttonLogout}
                source={require('../resources/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.viewLine} />

          <View
            style={{
              width: '100%',
              paddingLeft: 10,
              paddingRight: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 30,
            }}>
            <Text style={{width: '15%'}}>STT</Text>
            <Text style={{width: '60%'}}>Tên hàng</Text>
            <Text style={{width: '20%'}}>Số lượng</Text>
          </View>

          <FlatList
            data={this.state.arrayData}
            renderItem={({item, index}) => (
              <DetailProductCell data={item.model} index={index} />
            )}
            keyExtractor={item => item.model.AddDetailID.toString()}
          />
          <View style={styles.viewBottomButton}>
            <TouchableOpacity
              style={styles.button}
              onPress={this._cancelButton_clicked}>
              <Text style={styles.textButton}>{Language.CANCEL}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  containerItem: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  headerView: {
    height: 45,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'black',
    fontSize: 22,
    fontWeight: '700',
  },
  buttonLogout: {
    width: 20,
    height: 20,
  },
  viewLine: {
    height: 1,
    backgroundColor: 'black',
  },
  viewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    width: 100,
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    height: 30,
    marginLeft: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 5,
    paddingVertical: 0,
  },
  button: {
    borderWidth: 1,
    backgroundColor: '#5EB45F',
    borderColor: '#20A422',
    width: 120,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  autocompleteContainer: {
    backgroundColor: 'red',
    borderWidth: 0,
  },
  viewBottomButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
    height: 35,
  },
});
