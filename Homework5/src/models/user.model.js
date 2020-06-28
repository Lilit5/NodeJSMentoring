const { DataTypes } = require('sequelize');

class Models {
    constructor() {
        this.Users = {
            id: { type: DataTypes.INTEGER, primaryKey: true },
            login: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING },
            age: { type: DataTypes.INTEGER },
            isdeleted: { type: DataTypes.BOOLEAN },
        }
    }
}

export const model = new Models();