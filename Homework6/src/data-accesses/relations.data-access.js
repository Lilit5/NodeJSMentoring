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

	async startTransaction() {
		return await this.sequelize.transaction();
	}
}

export const relationsData = new RelationsData();