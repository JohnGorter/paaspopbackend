"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var socket_io_1 = __importDefault(require("socket.io"));
var http_1 = __importDefault(require("http"));
var dataController = __importStar(require("./api/controllers/dataController"));
var app = express_1.default();
var server = new http_1.default.Server(app);
var io = socket_io_1.default(server);
var clientsocket;
app.use(body_parser_1.default.json());
app.use(express_1.default.static('./public'));
app.get('/data', dataController.index);
app.post('/data', dataController.newdata(function (data) {
    clientsocket.emit("response", JSON.stringify(data));
}));
server.listen(1337, function () {
    console.log("express started");
});
io.on('connection', function (socket) {
    console.log('connection initiated');
    clientsocket = socket;
    socket.on('command', function (msg) {
        switch (msg.command) {
            case "stopcam": {
                break;
            }
            case "startcam": {
                break;
            }
            case "stopwifi": {
                break;
            }
            case "startwifi": {
                break;
            }
        }
    });
});
