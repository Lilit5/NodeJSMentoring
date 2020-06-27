const { DataTypes } = require('sequelize');
import { TABLE_NAME, GROUPS_TABLE_NAME } from "../common/constants";

class relationsModels {
    constructor() {
        this.Relations = {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true
			},
			userId: {
				type: DataTypes.INTEGER,
				references: {
					model: TABLE_NAME,
					key: 'id'
				},
				onDelete: 'cascade'
			},
			groupId: {
				type: DataTypes.INTEGER,
				references: {
					model: GROUPS_TABLE_NAME,
					key: 'id'
				},
				onDelete: 'cascade'
			},
        }
    }
}

export const relationsModel = new relationsModels();