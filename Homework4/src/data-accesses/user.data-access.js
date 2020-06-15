const Pg = require("pg").Client;
const connection = "postgres://postgres:post123@localhost/apicrud";
const { Sequelize } = require('sequelize');
import { TABLE_NAME, GROUPS_TABLE_NAME } from "../common/constants";
import { model } from "../models/user.model";
import { groupModel } from "../models/group.model";

class UsersData {
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
		this.Users = this.sequelize.define(TABLE_NAME, model.Users,
		{
			timestamps: false,
			freezeTableName: true
		});
		this.Groups = this.sequelize.define(GROUPS_TABLE_NAME, groupModel.Groups,
		{
			timestamps: false,
			freezeTableName: true
		});
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

	async objectCreateQuery(body) {
		this.sequelize.authenticate().then(() => console.log("Authorized successful"));
		return this.Users.create(body, { fields: ['id', 'login', 'password', 'age', 'isdeleted'] });
	}

	async createGroup(body) {
		return this.Groups.create(body);
	}

	async objectUpdateQuery(toUpdate, id) {
        return this.Users.update(toUpdate, { where: {id}, returning: true, raw: true });
	}

	async updateGroup(toUpdate, id) {
        return this.Groups.update(toUpdate, { where: {id}, returning: true, raw: true });
	}

	async findByUsername(userName) { 
		return this.Users.findOne({where: {login: userName}, returning: true, raw: true});
	}

	async findByGroupname(name) { 
		return this.Groups.findOne({where: {name}, returning: true, raw: true});
	}

	async getUserById(id) {
		return this.Users.findOne({where: {id}, returning: true, raw: true});
	}

	async getGroupById(id) {
		return this.Groups.findOne({where: {id}, returning: true, raw: true});
	}
}

export const usersData = new UsersData();