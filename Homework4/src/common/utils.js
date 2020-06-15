import { GET_FROM_TABLE, CREATE_USERS_TABLE, TABLE_NAME, GROUPS_TABLE_NAME, CREATE_GROUPS_TABLE } from "./constants";
import { usersData } from "../data-accesses/user.data-access";

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
}
export const utils = new Utils();
