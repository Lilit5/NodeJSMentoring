const Pg = require("pg").Client;
const connection = "postgres://postgres:post123@localhost/apicrud";
const { Sequelize, DataTypes } = require('sequelize');
import { GET_FROM_TABLE, CREATE_USERS_TABLE } from "./constants"

class Utils {

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
		this.Users = this.sequelize.define('users', {
			id: { type: DataTypes.INTEGER, primaryKey: true },
			login: { type: DataTypes.STRING },
			password: { type: DataTypes.STRING },
			age: { type: DataTypes.INTEGER },
			isdeleted: { type: DataTypes.BOOLEAN },
		},
		{
			timestamps: false
		});
	}

	sendQuery(query) {
		// let json;
		return this.pg.query(query)
			.then((result) => {
				console.log(query);
				// console.log("typeoooooooooooof ",typeof result.rows);
				//  return JSON.stringify(result.rows);
				return result.rows;
				// console.log("resp1: ", json);
				// json;
			})
			.catch(err => { throw new Error(`Failed runing psql querry: ${err}`) })
		// .then(() => this.pg.end());
		// console.log("resp: ", json);
		// return json;
	}

	async objectCreateQuery(body) {
		this.sequelize.authenticate().then(() => console.log("Authorized successful"));
		return this.Users.create(body, { fields: ['id', 'login', 'password', 'age', 'isdeleted'] });
		// this.sequelize.close();
	}

	async getAutoSuggestUsers(loginSubstring) {
		const users = await this.sendQuery(GET_FROM_TABLE("users"));
		users.sort((usr1, usr2) => {
			return usr1.login >= usr2.login ? 1 : -1;
		});
		let filteredUsers = users.filter(usr => {
			return usr.login.search(loginSubstring) !== -1 ? true : false;
		});
		if (filteredUsers.length === 0) {
			throw { message: `No such user with "${loginSubstring}" in it as a substring` };
		}
		else return filteredUsers;
	};
}
export const utils = new Utils();
