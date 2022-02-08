import * as db from './database/'
import _ from 'lodash'
import SQLite from 'react-native-sqlite-storage';
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = 'StockDatabase.db';
const database_version = '1.0';
const database_displayname = 'SQLite Stock Database';
const database_size = 20000000000000000000;
const openDatabase = SQLite.openDatabase(
    database_name,
    database_version,
    database_displayname,
    database_size,
  )
export default database = () => {
    const detailAddProductDB = db.DetailAddProductDB(SQLite, openDatabase);
    const productDB = db.ProductDB(SQLite, openDatabase);
    const stockDB = db.StockDB(SQLite, openDatabase);
    const stockTakeDB = db.StockTakeDB(SQLite, openDatabase);
    const stockTakeProductDB = db.StockTakeProductDB(SQLite, openDatabase);

    return {
        ...detailAddProductDB,
        ...productDB,
        ...stockDB,
        ...stockTakeDB,
        ...stockTakeProductDB
    };
}