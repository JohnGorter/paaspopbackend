import express from 'express'; 
import bodyParser from 'body-parser';
import socketIO from 'socket.io';
import http from 'http';

import * as dataController from './api/controllers/dataController';

const app = express();
const server = new http.Server(app);
const io = socketIO(server);
let clientsocket:SocketIO.Socket;

app.use(bodyParser.json());
app.use(express.static('./public'));

app.get('/data', dataController.index);
app.post('/data', dataController.newdata((data:any) => {  if (clientsocket) clientsocket.emit("response", JSON.stringify(data)); }));

io.on('connection', function(socket){ clientsocket = socket; });

server.listen(1337, () => { console.log("express started"); });

