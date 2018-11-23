import express from "express"
import path from "path";
import fs from "fs";
import Cmd from "../Cmd";
import Stype from "../Stype";

import log = require("../../utils/log");
import game_config from "../game_config";


let app = express();
let host = game_config.webserver.host;
let port = game_config.webserver.port;

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


if(fs.existsSync("www_root")) {
    app.use(express.static(path.join(process.cwd(), "www_root")));    
}else {
    log.warn("www_root is not exist!!!!!");
}


log.info("webserver stated at ", host, port);



app.get("/server_info", (request, response) => {
    let data = {
        host: game_config.gateway_config.host,
        tcp_port: game_config.gateway_config.ports[0],
        ws_port: game_config.gateway_config.ports[1],
    }

    let str_data = JSON.stringify(data);
    response.send(str_data);
});

app.listen(port);


