const Pg = require("pg").Client;
const connection = "postgres://postgres:post123@localhost/apicrud";
const { Sequelize, DataTypes } = require('sequelize');
import { RELATIONS_TABLE_NAME } from "../common/constants";
import { relationsModel } from "../models/relations.model";

class RelationsData {
	constructor() {
		this.pg = new Pg(connection);
		this.pg.connect();
		this.sequelize = new Sequelize('apicrud', 'postgres', 'post123', {
			host: 'localhost',
			dialect: 'postgres',
			pool: {
				max: 5,
				min: 0,
				idle: 10000
			}
		});
		this.Relations = this.sequelize.define(RELATIONS_TABLE_NAME, relationsModel.Relations,
		{
			timestamps: false,
			freezeTableName: true
		});
		this.transaction = await this.sequelize.transaction();
		this.queryInterface = this.sequelize.getQueryInterface();
		this.sequelize.authenticate().then(() => console.log("Authorized successful"));

	}

	sendQuery(query) {
		return this.pg.query(query)
			.then((result) => {
				console.log(query);
				return result.rows;
			})
			.catch(err => { throw new Error(`Failed runing psql querry: ${err}`) })
	}

	async createTable(tableName) {
		return this.queryInterface.createTable(tableName, relationsModel.Relations);
	}

	async createRelation(body) {
		return this.Relations.create(body);
	}

	async findAllRecords() {
			return this.Relations.findAll({ raw: true });
	}
	// async updateGroup(toUpdate, id) {
    //     return this.Groups.update(toUpdate, { where: {id}, returning: true, raw: true });
	// }

	// async findByGroupname(name) { 
	// 	console.log("eeeeeeeeeeeeeeeeeeee");
	// 	return this.Groups.findOne({where: {name}, returning: true, raw: true});
	// }

	// async getGroupById(id) {
	// 	return this.Groups.findOne({where: {id}, returning: true, raw: true});
	// }

	// async deleteGroup(id) {
	// 	return this.Groups.destroy({where: {id}});
	// }

	// async wrapWithTransaction(queries) {
	// 	try {
			
	// 	} catch(err) {
	// 		await this.transaction.rollback();
	// 		throw new Error("An error occured during query transaction, rolling back the transaction: ", err);
	// 	}
	// }
}

export const relationsData = new RelationsData();