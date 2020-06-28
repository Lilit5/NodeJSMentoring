const express = require('express');
import { utils } from './common/utils';
import { UserController } from './controllers/user.controller';
import { GroupController } from './controllers/group.controller';
import { GROUPS_TABLE_NAME, TABLE_NAME } from "./common/constants";

utils.createTable(TABLE_NAME)
.then(() => console.log("Initialized app."))
.catch((err) => {throw new Error(`An error occured while creating table, message: ${err}`)});

utils.createGroupTable()
.then(() => console.log("Created Groups table."))
.catch((err) => {throw new Error(`An error occured while creating table, message: ${err}`)});

utils.createRelationsTable()
.then(() => console.log("Created Relations Table."))
.catch((err) => {throw new Error(`An error occured while creating table, message: ${err}`)});

const app = express();
app.use(express.json());
app.use('/users', UserController);
app.use('/groups', GroupController);

app.get('/', (req, res) => {
    res.send("!!! Hello world !!!");
});

// Testing addUsersToGroup function
// utils.addUsersToGroup(1,1)
// .then((res) => console.log("Added User to Group: ", res))
// .catch((err) => {throw new Error(`An error occured while adding user to group, message: ${err}`)});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))
