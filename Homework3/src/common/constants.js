export const user = {
    id: 1,
    login: "login",
    password: "passwd!",
    age: 4,
    iSDeleted: false,
};

export const TABLE_NAME = "users6";

export const CREATE_USERS_TABLE = tableName => `create table ${tableName}
(id int, login text, password text, age int, isDeleted bool);`

export const GET_FROM_TABLE = tableName => `SELECT * FROM ${tableName};`