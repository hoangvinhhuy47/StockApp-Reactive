export class ProductModel {
  ProductID;
  BarCode;
  Code;
  Name;
  SearchString;

  //for stock take product
  StockTakeID;
  Quantity;
  Note;
  Count;
  SortOrder;
  DetailID;

  constructor() {}

  setData = data => {
    this.ProductID = data.ProductID;
    this.BarCode = data.BarCode;
    this.Code = data.Code;
    this.Name = data.Name;
    this.UnitName = data.UnitName;
    this.SearchString = data.SearchString;

    this.StockTakeID = data.StockTakeID;
    this.Quantity = data.Quantity;
    this.Note = data.Note;
    this.Count = data.Count;
    this.SortOrder = data.SortOrder;
    this.DetailID = data.DetailID;
  };
}
