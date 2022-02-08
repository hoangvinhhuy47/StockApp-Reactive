import {ProductModel} from '../models/ProducModel.js';
export const ProductDB = (SQLite, openDatabase)=> {
  //Product
  initDBProduct =()=> {
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
              db.executeSql('SELECT 1 FROM ProductTable LIMIT 1')
                .then(() => {
                  console.log('Database is ready ... executing query ...');
                })
                .catch(error => {
                  console.log('Received error: ', error);
                  console.log('Database not yet ready ... populating data');
                  db.transaction(tx => {
                    tx.executeSql(
                      'CREATE TABLE IF NOT EXISTS ProductTable (ProductID TEXT, BarCode TEXT, Code TEXT, Name TEXT, UnitName TEXT, SearchString TEXT)',
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

  addProduct = (model) => {
    return new Promise(resolve => {
      this.initDBProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('INSERT INTO ProductTable VALUES (?,?,?,?,?,?)', [
              model.ProductID,
              model.BarCode,
              model.Code,
              model.Name,
              model.UnitName,
              model.SearchString,
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

  addListProduct = (list) => {
    return new Promise(resolve => {
      let strings = '';

      let values = [];
      for (let model of list) {
        values.push(model.ProductID);
        values.push(model.BarCode);
        values.push(model.Code);
        values.push(model.Name);
        values.push(model.UnitName)
        values.push(model.SearchString);

        strings += '(?,?,?,?,?,?),';
      }

      if (strings != '') {
        strings = strings.substring(0, strings.length - 1);
      }

      this.initDBProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql(
              'INSERT INTO ProductTable VALUES ' + strings,
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

  getProductByBarCode = (barcode)=> {
    return new Promise(resolve => {
      this.initDBProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM ProductTable WHERE BarCode = ?', [
              barcode,
            ]).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;

              if (len > 0) {
                let row = results.rows.item(0);
                let model = new ProductModel();
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

  getProductByCode = (code)=> {
    return new Promise(resolve => {
      this.initDBProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM ProductTable WHERE Code = ?', [
              code,
            ]).then(([tx, results]) => {
              console.log('Query completed');
              var len = results.rows.length;
              if (len > 0) {
                let row = results.rows.item(0);
                let model = new ProductModel();
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

  getListProduct = () => {
    return new Promise(resolve => {
      const products = [];
      this.initDBProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('SELECT * FROM ProductTable', []).then(
              ([tx, results]) => {
                console.log('Query completed');
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  let model = new ProductModel();
                  model.setData(row);
                  products.push({model});
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

  deleteProduct = ()=> {
    return new Promise(resolve => {
      this.initDBProduct()
        .then(db => {
          db.transaction(tx => {
            tx.executeSql('DELETE FROM ProductTable', []).then(
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
    initDBProduct,
    addProduct,
    addListProduct,
    getProductByBarCode,
    getProductByCode,
    getListProduct,
    deleteProduct
  }
}