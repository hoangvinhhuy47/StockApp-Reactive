export class StockTakeModel {

    StockTakeID;
    Name;
    AccountingDate;
    StockID;
    StockName;
    Notes;
    CreateBy;
    UpdateBy;
    Status;

    constructor() {

    }

    setData = (data) => {
        this.StockTakeID           = data.StockTakeID;
        this.Name                  = data.Name;
        this.AccountingDate        = data.AccountingDate;
        this.StockID               = data.StockID;
        this.StockName             = data.StockName;
        this.Notes                 = data.Notes;
        this.CreateBy              = data.CreateBy;
        this.UpdateBy              = data.UpdateBy;
        this.Status                = data.Status;
    }
}