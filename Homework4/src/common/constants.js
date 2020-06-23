export const TABLE_NAME = "users12";
export const GROUPS_TABLE_NAME = "groups14";
export const RELATIONS_TABLE_NAME = "usersGroupsRelations3";

export const CREATE_USERS_TABLE = tableName => `create table ${tableName}
(id int primary key, login text, password text, age int, isDeleted bool);`;

export const CREATE_GROUPS_TABLE = tableName => `create table ${tableName}
(id int primary key, name text, permissions text);`;

export const CREATE_RELATIONS_TABLE = tableName => `create table ${tableName}
(rel_id int primary key, user_id int references ${TABLE_NAME} (id) ON DELETE CASCADE, group_id int references ${GROUPS_TABLE_NAME} (id) ON DELETE CASCADE);`;

export const CREATE_RELATION = (rId, gId, uId) => `insert into ${RELATIONS_TABLE_NAME} (rel_id, user_id, group_id) values (${rId}, ${uId}, ${gId});`;

export const GET_FROM_TABLE = tableName => `SELECT * FROM ${tableName};`;

export const ERROR = (status, message) => {return {status, message: {message}}};

export const PERMISSIONS = ["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"];