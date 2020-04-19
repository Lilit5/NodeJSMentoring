const getAutoSuggestUsers = (loginSubstring, limit) => {
	let users = [...limit];
	users.sort((usr1, usr2) => {
		// if (usr1.login < usr2.login) return -1;
		// if (usr1.login >= usr2.login) return 1;
		return usr1.login >= usr2.login ? 1 : -1;
	});
	let filteredUsers = users.filter(usr => {
		return usr.login.search(loginSubstring) !== -1 ? true : false;
		// if (usr.login.search(loginSubstring) !== -1) return true;
		// else return false;
	});
	if (filteredUsers.length === 0){
	    throw {message: `No such user with "${loginSubstring}" in it as a substring`};
    }
	else return filteredUsers;
};

export default getAutoSuggestUsers;
