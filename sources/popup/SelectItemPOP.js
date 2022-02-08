import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import ItemCell from '../cells/ItemCell.js';

import Language from '../resources/Language.js';
import database from '../Database.js';
const db = database();

export default class AddNewProductPOP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      arrayStock: [],
    };

    this.value = this.props.value;
  }

  componentDidMount() {
    db.getListStock()
      .then(data => {
        if(this.props?.addItem){
          data.unshift(this.props.addItem)
        }
        this.setState({arrayStock: data});
      })
      .catch(err => {});
  }

  //handle action
  _cancelButton_clicked = () => {
    this.props.cancelEvent();
  };

  _itemSelected_click = item => {
    this.props.okEvent(item);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerItem}>
          <View style={styles.headerView}>
            <Text style={styles.headerTitle}>{Language.CHOOSE_STOCK}</Text>
            <TouchableOpacity onPress={this._cancelButton_clicked}>
              <Image
                style={styles.buttonLogout}
                source={require('../resources/close.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.viewLine} />
          <FlatList
            style={styles.list}
            data={this.state.arrayStock}
            renderItem={({item, index}) => (
              <ItemCell
                data={item}
                index={index}
                onPressItem={this._itemSelected_click}
              />
            )}
            keyExtractor={item => item.model.StockID}
          />
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
  list: {
    height: 300,
    marginLeft: 10,
    marginRight: 10,
  },
});
