const Pg = require("pg").Client;
const connection = "postgres://postgres:post123@localhost/apicrud";
const { Sequelize } = require('sequelize');
import { TABLE_NAME } from "../common/constants";
import { model } from "../models/user.model";

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

	async objectUpdateQuery(toUpdate, id) {
            return this.Users.update(toUpdate, { where: {id}, returning: true, raw: true });
	}

	async findByUsername(userName) { 
		return this.Users.findOne({where: {login: userName}, returning: true, raw: true})
	}
	async getUserById(id) {
		return this.Users.findOne({where: {id}, returning: true, raw: true});
	}
}

export const usersData = new UsersData();