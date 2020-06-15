const { DataTypes } = require('sequelize');

class groupModels {
    constructor() {
        this.Groups = {
            id: { type: DataTypes.INTEGER, primaryKey: true },
            name: { type: DataTypes.STRING },
            permissions: { type: DataTypes.STRING },
        }
    }
}

export const groupModel = new groupModels();