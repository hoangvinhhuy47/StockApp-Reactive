export class StockModel {
  StockID;
  StockCode;
  StockName;

  constructor() {}

  setData = data => {
    this.StockID = data.StockID;
    this.StockCode = data.StockCode;
    this.StockName = data.StockName;
  };
}
