import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

export default class ItemCell extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.props.onPressItem(this.props.data.model)}>
        <View style={styles.viewTop}>
          <Text style={styles.numberLabel}>{this.props.index + 1}.</Text>
          <Text style={styles.nameLabel}>
            {this.props.data.model.StockName}
          </Text>
        </View>
        <View style={styles.viewLine} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  viewTop: {
    flex: 1,
    flexDirection: 'row',
  },
  numberLabel: {
    fontSize: 20,
  },
  nameLabel: {
    fontSize: 20,
    marginLeft: 10,
  },
  viewLine: {
    height: 0.5,
    backgroundColor: 'gray',
    marginTop: 5,
  },
});
