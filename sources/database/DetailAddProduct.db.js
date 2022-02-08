import {AddProductModel} from '../models/AddProductModel.js';
export const DetailAddProductDB = (SQLite, openDatabase)=> {

    //Detail add product in check form
   initDBDetailAddProduct = () => {
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
              db.executeSql('SELECT 1 FROM DetailAddProductTable LIMIT 1')
                .then(() => {
                  console.log('Database is ready ... executing query ...');
                })
                .catch(error => {
                  console.log('Received error: ', error);
                  console.log('Database not yet ready ... populating data');
                  db.transaction(tx => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS DetailAddProductTable (AddDetailID INTEGER PRIMARY KEY AUTOINCREMENT,' +
                        'ProductID TEXT, StockTakeID TEXT,' +
                        'Name TEXT,' +
                        'Quantity TEXT)',
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

  getListDetailAddProduct = (stockTakeID, productID) => {
    return new Promise(resolve => {
      const products = [];
      this.initDBDetailAddProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM DetailAddProductTable WHERE StockTakeID = ? AND ProductID = ?',
              [stockTakeID, productID],
            ).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              for (let i = 0; i < len; i++) {
                let model = new AddProductModel();
                model.setData(results.rows.item(i));
                products.push({model});
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

  addDetailAddProduct = (product, stockTakeID, quantity)=> {
    return new Promise(resolve => {
      this.initDBDetailAddProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'INSERT INTO DetailAddProductTable (ProductID,StockTakeID,Name,Quantity) VALUES (?,?,?,?)',
              [product.ProductID, stockTakeID, product.Name, quantity],
            ).then(([tx, results]) => {
              resolve(results);
            });
          }).then(result => {
            // console.log(result);
          });
        })
        .catch(err => {
          console.log(err);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  deleteDetailAddProduct = (stockTakeID, productID) => {
    return new Promise(resolve => {
      this.initDBDetailAddProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'DELETE FROM DetailAddProductTable WHERE StockTakeID = ? AND ProductID = ?',
              [stockTakeID, productID],
            ).then(([tx, results]) => {
              resolve(results);
            });
          }).then(result => {
            console.log(result);
          });
        })
        .catch(err => {
          console.log(err);
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  return {
    initDBDetailAddProduct,
    getListDetailAddProduct,
    addDetailAddProduct,
    deleteDetailAddProduct
  }
}