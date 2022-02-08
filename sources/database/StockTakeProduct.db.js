
import {
  ProductModel
} from '../models/ProducModel.js';
export const StockTakeProductDB = (SQLite, openDatabase) => {

  //Stock Take Product
  initDBStockTakeProduct = () => {
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
              db.executeSql('SELECT 1 FROM StockTakeProductTable LIMIT 1')
                .then(() => {
                  console.log('Database is ready ... executing query ...');
                })
                .catch(error => {
                  console.log('Received error: ', error);
                  console.log('Database not yet ready ... populating data');
                  db.transaction(tx => {
                      tx.executeSql(
                        'CREATE TABLE IF NOT EXISTS StockTakeProductTable (StockTakeID INTEGER,' +
                        'DetailID TEXT UNIQUE, ProductID TEXT, BarCode TEXT,' +
                        'Code TEXT, Name TEXT, SearchString TEXT,' +
                        'Quantity TEXT, Note TEXT, Count TEXT,' +
                        'SortOrder INTEGER PRIMARY KEY AUTOINCREMENT)',
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

  addProductStockTake = (model, stockTakeID, quantity, note, count) => {
    return new Promise(resolve => {
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'INSERT INTO StockTakeProductTable (StockTakeID,DetailID,ProductID,BarCode,Code,Name,SearchString,Quantity,Note,Count) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [
                  stockTakeID,
                  model.DetailID,
                  model.ProductID,
                  model.BarCode,
                  model.Code,
                  model.Name,
                  model.SearchString,
                  quantity,
                  note,
                  count,
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

  getListProductStockTake = () => {
    return new Promise(resolve => {
      const products = [];
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql('SELECT * FROM StockTakeProductTable', []).then(
                ([tx, results]) => {
                  console.log('Query completed');
                  var len = results.rows.length;
                  for (let i = 0; i < len; i++) {
                    let row = results.rows.item(i);
                    let model = new ProductModel();
                    model.setData(row);
                    products.push({
                      model
                    });
                  }
                  resolve(products);
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

  getListProductStockTakeByStockTakeID = (stockTakeID) => {
    return new Promise(resolve => {
      const products = [];
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM StockTakeProductTable WHERE StockTakeID = ? ORDER BY SortOrder DESC;',
                [stockTakeID],
              ).then(([tx, results]) => {
                console.log('Query completed');
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  let model = new ProductModel();
                  model.setData(row);
                  products.push({
                    model
                  });
                }
                resolve(products);
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

  getProductStockTakeByStockTakeIDAndProductID = (stocktakeID, productID) => {
    return new Promise(resolve => {
      // const products = [];
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM StockTakeProductTable WHERE StockTakeID = ? AND ProductID = ?',
                [stocktakeID, productID],
              ).then(([tx, results]) => {
                var len = results.rows.length;
                if (len == 0) {
                  resolve(null);
                  return;
                }
                let row = results.rows.item(0);
                let model = new ProductModel();
                model.setData(row);
                resolve(model);
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

  updateProductStockTakeByDetailID = (DetailID, quantity, count) => {
    return new Promise(resolve => {
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'UPDATE StockTakeProductTable SET Quantity = ?, Count = ? WHERE DetailID = ?',
                [quantity, count, DetailID],
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

  updateProductStockTakeByProduct = (product) => {
    return new Promise(resolve => {
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'UPDATE StockTakeProductTable SET Quantity = ?, Note = ? WHERE DetailID = ?',
                [product.Quantity, product.Note, product.DetailID],
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

  deleteProductStockTakeByStockTakeID = (stockTakeID) => {
    return new Promise(resolve => {
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM StockTakeProductTable WHERE StockTakeID = ?',
                [stockTakeID],
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

  deleteProductStockTakeByDetailID = (detailID) => {
    return new Promise(resolve => {
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql(
                'DELETE FROM StockTakeProductTable WHERE DetailID = ?',
                [detailID],
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

  deleteAllStockTakeProduct = () => {
    return new Promise(resolve => {
      this.initDBStockTakeProduct()
        .then(db => {
          db.transaction(tx => {
              tx.executeSql('DELETE FROM StockTakeProductTable', []).then(
                ([tx, results]) => {
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
    initDBStockTakeProduct,
    addProductStockTake,
    getListProductStockTake,
    getListProductStockTakeByStockTakeID,
    getProductStockTakeByStockTakeIDAndProductID,
    updateProductStockTakeByDetailID,
    updateProductStockTakeByProduct,
    deleteProductStockTakeByStockTakeID,
    deleteProductStockTakeByDetailID,
    deleteAllStockTakeProduct
  }
}