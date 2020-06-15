const Pg = require("pg").Client;
const connection = "postgres://postgres:post123@localhost/apicrud";
const { Sequelize } = require('sequelize');
import { GROUPS_TABLE_NAME } from "../common/constants";
import { groupModel } from "../models/group.model";

class GroupsData {
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

	async createGroup(body) {
		return this.Groups.create(body);
	}

	async updateGroup(toUpdate, id) {
        return this.Groups.update(toUpdate, { where: {id}, returning: true, raw: true });
	}

	async findByGroupname(name) { 
		console.log("eeeeeeeeeeeeeeeeeeee");
		return this.Groups.findOne({where: {name}, returning: true, raw: true});
	}

	async getGroupById(id) {
		return this.Groups.findOne({where: {id}, returning: true, raw: true});
	}

	async deleteGroup(name) {
		return this.Groups.destroy({where: {name}});
	}
}

export const groupsData = new GroupsData();