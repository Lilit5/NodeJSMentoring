export const TABLE_NAME = "users10";

export const CREATE_USERS_TABLE = tableName => `create table ${tableName}
(id int, login text, password text, age int, isDeleted bool);`;

export const GET_FROM_TABLE = tableName => `SELECT * FROM ${tableName};`;

export const ERROR = (status, message) => {return {status, message: {message}}};