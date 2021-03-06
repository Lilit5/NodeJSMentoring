const express = require('express');
const cors = require('cors');
import { utils } from './common/utils';
import { UserController } from './controllers/user.controller';
import { GroupController } from './controllers/group.controller';
import { AuthController } from './controllers/auth.controller';
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
app.use(cors());
// --Task-6.2---------------------------------------------------
// In case of domain changes add the to the config bellow and uncomment this section
// var corsOptions = {
//   origin: 'http://example.com',
//   optionsSuccessStatus: 200 
// }
// app.use(cors(corsOptions));
// -------------------------------------------------------------
app.use(express.json());
app.use(utils.validateToken);
app.use('/users', UserController);
app.use('/groups', GroupController);
app.use('/auth', AuthController);

app.get('/', (req, res) => {
    res.send("!!! Hello world !!!");
});

// Testing addUsersToGroup function
utils.addUsersToGroup(1,1)
.then((res) => console.log("Added User to Group: ", res))
.catch((err) => {throw new Error(`An error occured while adding user to group, message: ${err}`)});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))
