import {
	GET_FROM_TABLE,
	CREATE_USERS_TABLE,
	TABLE_NAME,
	GROUPS_TABLE_NAME,
	CREATE_GROUPS_TABLE,
	RELATIONS_TABLE_NAME,
	CREATE_DEFAULT_USER,
	CREATE_DEFAULT_GROUP,
	JWT_KEY
} from "./constants";
import { usersData } from "../data-accesses/user.data-access";
import { relationsData } from '../data-accesses/relations.data-access';
const jwt = require('jsonwebtoken');

class Utils {

	async createTable() {
		await usersData.sendQuery(CREATE_USERS_TABLE(TABLE_NAME));
		await usersData.sendQuery(CREATE_DEFAULT_USER);
		const table = await usersData.sendQuery(GET_FROM_TABLE(TABLE_NAME));
		console.log("Created Table ", table);
	};

	async createGroupTable() {
		await usersData.sendQuery(CREATE_GROUPS_TABLE(GROUPS_TABLE_NAME));
		await usersData.sendQuery(CREATE_DEFAULT_GROUP);
		const table = await usersData.sendQuery(GET_FROM_TABLE(GROUPS_TABLE_NAME));
		console.log("Created Table ", table);
	}

	async createRelationsTable() {
		await relationsData.createTable(RELATIONS_TABLE_NAME);
		const table = await usersData.sendQuery(GET_FROM_TABLE(GROUPS_TABLE_NAME));
		console.log("Created Table ", table);
	}

	async getAutoSuggestUsers(loginSubstring) {
		const users = await usersData.sendQuery(GET_FROM_TABLE(TABLE_NAME));
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

	async addUsersToGroup(userId, groupId) {
		const transact = await relationsData.startTransaction();
		try {
			const relations = await relationsData.findAllRecords();
			const relation = {
				id: relations.length + 1,
				userId,
				groupId
			}
			await relationsData.createRelation(relation);
			await transact.commit();
		} catch (err) {
			await transact.rollback();
			throw new Error(`An error occured during query transaction, rolling back the transaction: ${err}`);
		}
	}

	login(username, password) {
		const payload = { "login": username, password };
		return jwt.sign(payload, JWT_KEY, { expiresIn: 300 });
	}

	validateToken(req, res, next) {
		if (req.originalUrl === '/auth')
			next();
		else {
			let token = req.headers['x-access-token'];
			if (token) {
				jwt.verify(token, JWT_KEY, (err, decoded) => {
					if (err) {
						res.status(403).send({ success: false, message: 'Forbidden Error' });
					} else {
						next();
					}
				})
			} else {
				res.status(401).send({ success: false, message: 'Unauthorized Error' });
			}
		}
	}
}
export const utils = new Utils();
