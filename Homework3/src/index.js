const express = require('express');
import { utils } from './common/utils';
import {UserController} from './controllers/user.controller';

utils.createTable()
.then(() => console.log("Initialized app."))
.catch((err) => {throw new Error(`An error occured while creating table, message: ${err}`)});

const app = express();
app.use(express.json());
app.use('/users', UserController);

app.get('/', (req, res) => {
    res.send("!!! Hello world !!!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))