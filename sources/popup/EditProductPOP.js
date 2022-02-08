
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import Language from '../resources/Language.js';

import database from '../Database.js';
const db = database();

export default class EditProductPOP extends Component {

    constructor(props) {
        super(props);

        this.product = this.props.product;

        this.state = {
            productBarCode: this.product.BarCode,
            productCode: this.product.Code,
            productName: this.product.Name,
            productQuantity: this.product.Quantity,
            productNote: this.product.Note
        };
    }

    _cancelButton_clicked = () => {
        this.props.cancelEditEvent();
    }

    _okButton_clicked = () => {
        this.product.Quantity = this.state.productQuantity;
        this.product.Note = this.state.productNote;

        db.updateProductStockTakeByProduct(this.product).then((data) => {
            this.props.okEditEvent();
        }).catch((err) => {
            
        })
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.container}>
                    <View style={styles.containerItem}>
                        <View style={styles.headerView}>
                            <Text style={styles.headerTitle}>{Language.EIDT}</Text>
                            <TouchableOpacity onPress={this._cancelButton_clicked}>
                                <Image style={styles.buttonLogout}
                                    source={require('../resources/close.png')} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.viewLine} />
                        {/* Barcode *} */}
                        <View style={styles.viewItem}>
                            <Text style={styles.label}>{Language.BARCODE}</Text>
                            <TextInput style={styles.textInput} editable={false} value={this.state.productBarCode} />
                        </View>
                        {/* Mã hàng *} */}
                        <View style={styles.viewItem}>
                            <Text style={styles.label}>{Language.PRODUCT_CODE}</Text>
                            <TextInput style={styles.textInput} editable={false} value={this.state.productCode} />
                        </View>
                        {/* Tên hàng *} */}
                        <View style={styles.viewItem}>
                            <Text style={styles.label}>{Language.PRODUCT_NAME}</Text>
                            <TextInput style={styles.textInput} editable={false} value={this.state.productName} />
                        </View>
                        {/* Số lượng *} */}
                        <View style={styles.viewItem}>
                            <Text style={styles.label}>{Language.QUANTITY}</Text>
                            <TextInput style={styles.textInput} keyboardType={"decimal-pad"}
                                value={this.state.productQuantity} onChangeText={(productQuantity) => this.setState({ productQuantity })} />
                        </View>
                        {/* Ghi chú *} */}
                        <View style={styles.viewItem}>
                            <Text style={styles.label}>{Language.NOTE}</Text>
                            <TextInput style={styles.textInput}
                                value={this.state.productNote} onChangeText={(productNote) => this.setState({ productNote })} />
                        </View>
                        <View style={styles.viewBottomButton}>
                            <TouchableOpacity style={styles.button} onPress={this._cancelButton_clicked}>
                                <Text style={styles.textButton}>{Language.CANCEL}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={this._okButton_clicked}>
                                <Text style={styles.textButton}>{Language.OK}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
        borderRadius: 10,
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
        height: 20
    },
    viewLine: {
        height: 1,
        backgroundColor: 'black'
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        marginLeft: 10,
        marginRight: 10
    },
    label: {
        fontSize: 18,
        width: 100,
        fontWeight: '500'
    },
    textInput: {
        flex: 1,
        height: 30,
        marginLeft: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 3,
        paddingLeft: 5,
        paddingVertical: 0
    },
    button: {
        borderWidth: 1,
        backgroundColor: '#5EB45F',
        borderColor: '#20A422',
        width: 120,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    viewBottomButton: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 20
    }
});