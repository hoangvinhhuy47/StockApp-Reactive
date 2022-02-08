export class UserModel {

    UserID;
    UserName;
    Password;
    PasswordEncode;
    FullName;

    constructor() {

    }

    setData = (data) => {
        this.UserID                    = data.UserID;
        this.UserName                  = data.UserName;
        this.Password                  = data.Password;
        this.PasswordEncode            = data.PasswordEncode;
        this.FullName                  = data.FullName;
    }
}