import {
    StockModel
} from '../models/StockModel.js';

export const StockDB = (SQLite, openDatabase)=>{
    initDB = ()=> {
        let db;
        return new Promise(resolve => {
            console.log('Plugin integrity check ...');
            SQLite.echoTest()
                .then(() => {
                    console.log('Integrity check passed ...');
                    console.log('Opening database ...');
                    openDatabase.then(DB => {
                            db = DB;
                            console.log('Database OPEN');
                            db.executeSql('SELECT 1 FROM StockTable LIMIT 1')
                                .then(() => {
                                    console.log('Database is ready ... executing query ...');
                                })
                                .catch(error => {
                                    console.log('Received error: ', error);
                                    console.log('Database not yet ready ... populating data');
                                    db.transaction(tx => {
                                            tx.executeSql(
                                                'CREATE TABLE IF NOT EXISTS StockTable (StockID TEXT, StockCode TEXT, StockName TEXT)',
                                            );
                                        })
                                        .then(() => {
                                            console.log('Table created successfully');
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });
                                });
                            resolve(db);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log('echoTest failed - plugin not functional');
                });
        });
    }

    //Stock
    closeDatabase = (db)=> {
        if (db) {
            console.log('Closing DB');
            db.close()
                .then(status => {
                    console.log('Database CLOSED');
                })
                .catch(error => {
                    this.errorCB(error);
                });
        } else {
            console.log('Database was not OPENED');
        }
    }

    addStock = (model)=> {
        return new Promise(resolve => {
            this.initDB()
                .then(db => {
                    db.transaction(tx => {
                            tx.executeSql('INSERT INTO StockTable VALUES (?,?,?)', [
                                model.StockID,
                                model.StockCode,
                                model.StockName,
                            ]).then(([tx, results]) => {
                                resolve(results);
                            });
                        })
                        .then(result => {
                            //this.closeDatabase(db);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    addListStock = (list)=> {
        return new Promise(resolve => {
            let strings = '';
            let values = [];

            for (let model of list) {
                values.push(model.StockID);
                values.push(model.StockCode);
                values.push(model.StockName);

                strings += '(?,?,?),';
            }

            if (strings != '') {
                strings = strings.substring(0, strings.length - 1);
            }

            this.initDBProduct()
                .then(db => {
                    db.transaction(tx => {
                            tx.executeSql(
                                'INSERT INTO StockTable VALUES ' + strings,
                                values,
                            ).then(([tx, results]) => {
                                resolve(results);
                            });
                        })
                        .then(result => {
                            //this.closeDatabase(db);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    getListStock =()=> {
        return new Promise(resolve => {
            const stocks = [];
            this.initDB()
                .then(db => {
                    db.transaction(tx => {
                            tx.executeSql('SELECT * FROM StockTable', []).then(
                                ([tx, results]) => {
                                    console.log('Query completed');
                                    var len = results.rows.length;
                                    for (let i = 0; i < len; i++) {
                                        let row = results.rows.item(i);
                                        let model = new StockModel();
                                        model.setData(row);
                                        stocks.push({
                                            model
                                        });
                                    }
                                    resolve(stocks);
                                },
                            );
                        })
                        .then(result => {
                            //this.closeDatabase(db);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    getStockById = (id)=> {
        return new Promise(resolve => {
            this.initDB()
                .then(db => {
                    db.transaction(tx => {
                            tx.executeSql('SELECT * FROM StockTable WHERE StockID = ?', [
                                id,
                            ]).then(([tx, results]) => {
                                if (results.rows.length > 0) {
                                    let row = results.rows.item(0);
                                    let model = new StockModel();
                                    model.setData(row);
                                    resolve(model);
                                } else {
                                    resolve(null);
                                }
                            });
                        })
                        .then(result => {
                            //this.closeDatabase(db);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    updateStock =(id, prod)=> {
        // return new Promise((resolve) => {
        //   this.initDB().then((db) => {
        //     db.transaction((tx) => {
        //       tx.executeSql('UPDATE Product SET prodName = ?, prodDesc = ?, prodImage = ?, prodPrice = ? WHERE prodId = ?', [prod.prodName, prod.prodDesc, prod.prodImage, prod.prodPrice, id]).then(([tx, results]) => {
        //         resolve(results);
        //       });
        //     }).then((result) => {
        //       //this.closeDatabase(db);
        //     }).catch((err) => {
        //       console.log(err);
        //     });
        //   }).catch((err) => {
        //     console.log(err);
        //   });
        // });
    }

    deleteStock = ()=> {
        return new Promise(resolve => {
            this.initDB()
                .then(db => {
                    db.transaction(tx => {
                            tx.executeSql('DELETE FROM StockTable', []).then(
                                ([tx, results]) => {
                                    console.log(results);
                                    resolve(results);
                                },
                            );
                        })
                        .then(result => {
                            //this.closeDatabase(db);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }
    return {
        initDB,
        closeDatabase,
        addStock,
        addListStock,
        getListStock,
        getStockById,
        updateStock,
        deleteStock
    }
}