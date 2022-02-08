
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

import Language from '../resources/Language.js';

import DateTimePicker from '@react-native-community/datetimepicker';

export default class AddNewProductPOP extends Component {

    constructor(props) {
        super(props);

        this.value = this.props.value;
    }

    //handle action
    _cancelButton_clicked = () => {
        this.props.cancelEvent();
    }

    _okButton_clicked = () => {
        this.props.okEvent(this.props.typePopup, this.value);
    }

    _onChange = (event, selectedDate) => {
        this.value = selectedDate;
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.containerItem}>
                    <View style={styles.headerView}>
                        <Text style={styles.headerTitle}>{Language.CHOOSE_DATE}</Text>
                        <TouchableOpacity onPress={this._cancelButton_clicked}>
                            <Image style={styles.buttonLogout}
                                source={require('../resources/close.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewLine} />
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={-4200}
                        value={this.value}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={this._onChange}
                    />
                    <View style={styles.viewButtonBottom}>
                        <TouchableOpacity style={styles.button} onPress={this._cancelButton_clicked}>
                            <Text style={styles.textButton}>{Language.CANCEL}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={this._okButton_clicked}>
                            <Text style={styles.textButton}>{Language.OK}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    containerItem: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10
    },
    headerView: {
        height: 45,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        color: 'black',
        fontSize: 22,
        fontWeight: '700'
    },
    buttonLogout: {
        width: 20,
        height: 20,
    },
    viewLine: {
        height: 1, 
        backgroundColor: 'black'
    },
    viewButtonBottom: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20
    },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        width: 120,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        fontSize: 18,
        fontWeight: '600',
        color: 'black'
    }
});