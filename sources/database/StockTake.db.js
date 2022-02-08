import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);
import {
  StockTakeModel
} from '../models/StockTakeModel.js';
export const StockTakeDB = (SQLite, openDatabase) => {
  //Stock Take
  initDBStockTake = ()=> {
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
              db.executeSql('SELECT 1 FROM StockTakeTable LIMIT 1')
                .then(() => {
                  console.log('Database is ready ... executing query ...');
                })
                .catch(error => {
                  console.log('Received error: ', error);
                  console.log('Database not yet ready ... populating data');

                  db.transaction(tx => {
                      tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS StockTakeTable (' +
                        'StockTakeID TEXT PRIMARY KEY,' +
                        'Name TEXT,' +
                        'AccountingDate TEXT,' +
                        'StockID TEXT,' +
                        'StockName TEXT,' +
                        'Notes TEXT,' +
                        'CreateBy TEXT,' +
                        'UpdateBy TEXT,' +
                        'Status INTEGER)',
                      );
                    })
                    .then(() => {})
                    .catch(error => {});
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

  addStockTake = (model)=> {
    return new Promise(resolve => {
      this.initDBStockTake()
        .then(db => {
          ')';
          db.transaction(tx => {
            tx.executeSql(
              'INSERT INTO StockTakeTable (StockTakeID,Name,AccountingDate,StockID,StockName,Notes,CreateBy,UpdateBy,Status) VALUES (?,?,?,?,?,?,?,?,?)',
              [
                model.StockTakeID,
                model.Name,
                model.AccountingDate,
                model.StockID,
                model.StockName,
                model.Notes,
                model.CreateBy,
                model.UpdateBy,
                model.Status,
              ],
            ).then(([tx, results]) => {
              resolve(results);
            });
          }).then(result => {});
        })
        .catch(err => {})
        .catch(err => {});
    });
  }

  getListStockTake = ()=> {
    return new Promise(resolve => {
      const stocks = [];
      this.initDBStockTake()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM StockTakeTable ORDER BY AccountingDate DESC',
                [],
              ).then(([tx, results]) => {
                console.log('Query completed');
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  let model = new StockTakeModel();
                  model.setData(row);
                  stocks.push({
                    model
                  });
                }
                resolve(stocks);
              });
            })
            .then(result => {
              ////this.closeDatabase(db);
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

  updateStockTakeByID = (model)=> {
    return new Promise(resolve => {
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'UPDATE StockTakeTable SET Name = ?,' +
                'AccountingDate = ?,' +
                'StockID = ?,' +
                'StockName = ?,' +
                'Notes = ?,' +
                'CreateBy = ?,' +
                'UpdateBy = ?,' +
                'Status = ?' +
                'WHERE StockTakeID = ?',
                [
                  model.Name,
                  model.AccountingDate,
                  model.StockID,
                  model.StockName,
                  model.Notes,
                  model.CreateBy,
                  model.UpdateBy,
                  model.Status,
                  model.StockTakeID,
                ],
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

  deleteStockTake = (stockTakeID) => {
    return new Promise(resolve => {
      this.initDBStockTake()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql('DELETE FROM StockTakeTable WHERE StockTakeID = ?', [
                stockTakeID,
              ]).then(([tx, results]) => {
                console.log(results);
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

  deleteAllStockTake =()=> {
    return new Promise(resolve => {
      this.initDBStockTake()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql('DELETE FROM StockTakeTable', []).then(
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
    initDBStockTake,
    addStockTake,
    getListStockTake,
    updateStockTakeByID,
    deleteStockTake,
    deleteAllStockTake
  }
}