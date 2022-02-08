import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native';

export default class ProductItemCell extends Component {
  constructor(props) {
    super(props);
  }

  _item_clicked = () => {
    this.props.onSelectItemEvent(this.props.data);
  };

  _editButton_clicked = () => {
    this.props.onEditEvent(this.props.data);
  };

  _deleteButton_clicked = () => {
    this.props.onDeleteEvent(this.props.data);
  };

  renderEditButton = () => {
    if (this.props.isSync) {
      return null;
    } else {
      return (
        <View style={styles.viewButton}>
          <TouchableOpacity onPress={this._editButton_clicked}>
            <Image
              source={require('../resources/edit.png')}
              style={styles.imageIcon}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  render() {
    return (
      <TouchableOpacity style={styles.container} onPress={this._item_clicked}>
        <View style={styles.viewTop}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <Text style={styles.numberLabel}>{this.props.index + 1}.</Text>
            <Text style={styles.nameLabel} numberOfLines={2}>
              {this.props.data.Name}
            </Text>
          </View>
          {this.renderEditButton()}
        </View>
        <View style={styles.viewBottom}>
          <Text style={styles.textLabel}>MH: {this.props.data.Code}</Text>
          <Text style={styles.textLabel}>SL: {this.props.data.Quantity}</Text>
          <Text style={[styles.textLabel, {marginLeft: 20}]}>
            Count: {this.props.data.Count}
          </Text>
        </View>
        <View style={styles.viewLine} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    backgroundColor: 'white',
  },
  viewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  numberLabel: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  nameLabel: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '400',
    marginRight: 15,
  },
  viewButton: {
    flexDirection: 'row',
    width: 25,
    justifyContent: 'space-between',
  },
  imageIcon: {
    width: 20,
    height: 20,
  },
  viewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  textLabel: {
    fontSize: 14,
  },
  viewLine: {
    height: 1,
    backgroundColor: 'gray',
    marginTop: 5,
  },
});
