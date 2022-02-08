export class AddProductModel {
  AddDetailID;
  ProductID;
  StockTakeID;
  Name;
  Quantity;

  constructor() {}

  setData = data => {
    this.AddDetailID = data.AddDetailID;
    this.ProductID = data.ProductID;
    this.StockTakeID = data.StockTakeID;
    this.Name = data.Name;
    this.UnitName = data.UnitName;
    this.Quantity = data.Quantity;
  };
}
