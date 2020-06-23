import { GET_FROM_TABLE, CREATE_USERS_TABLE, TABLE_NAME, GROUPS_TABLE_NAME, CREATE_GROUPS_TABLE, RELATIONS_TABLE_NAME, CREATE_RELATIONS_TABLE, CREATE_RELATION} from "./constants";
import { usersData } from "../data-accesses/user.data-access";
import { groupModel } from "../models/group.model";

class Utils {

	async createTable() {
		await usersData.sendQuery(CREATE_USERS_TABLE(TABLE_NAME));
		const table = await usersData.sendQuery(GET_FROM_TABLE(TABLE_NAME));
		console.log("Created Table ", table);
	};

	async createGroupTable() {
		await usersData.sendQuery(CREATE_GROUPS_TABLE(GROUPS_TABLE_NAME));
		const table = await usersData.sendQuery(GET_FROM_TABLE(GROUPS_TABLE_NAME));
		console.log("Created Table ", table);
	}

	async createRelationsTable() {
		await usersData.sendQuery(CREATE_RELATIONS_TABLE(RELATIONS_TABLE_NAME ));
		const table = await usersData.sendQuery(GET_FROM_TABLE(RELATIONS_TABLE_NAME));
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

	async addUsersToGroup(groupId, userId) {
		const relations = await usersData.sendQuery(GET_FROM_TABLE(RELATIONS_TABLE_NAME));
		await usersData.sendQuery(CREATE_RELATION(relations.length + 1, groupId, userId));
	}
}
export const utils = new Utils();
