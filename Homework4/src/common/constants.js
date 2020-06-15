export const TABLE_NAME = "users10";
export const GROUPS_TABLE_NAME = "groups12";

export const CREATE_USERS_TABLE = tableName => `create table ${tableName}
(id int, login text, password text, age int, isDeleted bool);`;

export const CREATE_GROUPS_TABLE = tableName => `create table ${tableName}
(id int, name text, permissions text);`;

export const GET_FROM_TABLE = tableName => `SELECT * FROM ${tableName};`;

export const ERROR = (status, message) => {return {status, message: {message}}};

export const PERMISSIONS = ["READ", "WRITE", "DELETE", "SHARE", "UPLOAD_FILES"];